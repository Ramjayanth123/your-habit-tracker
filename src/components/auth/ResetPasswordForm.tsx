
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof formSchema>;

const ResetPasswordForm: React.FC = () => {
  const { resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      await resetPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled in the auth context
      console.error('Reset password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in text-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent a password reset link to your email address. Please check your inbox.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Didn't receive an email? Check your spam folder or{' '}
            <button
              className="text-primary hover:underline"
              onClick={() => {
                setIsSubmitted(false);
                form.reset();
              }}
            >
              try again
            </button>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground">Enter your email to receive a reset link</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <Link to="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordForm;

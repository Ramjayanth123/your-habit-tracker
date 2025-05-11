
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-5xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't find the page you're looking for: {location.pathname}
        </p>
        <Button asChild>
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

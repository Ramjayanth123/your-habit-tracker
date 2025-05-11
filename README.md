# 🌱 HabitVault – Daily Habit Tracker with Visual Streaks

## 📋 Introduction
HabitVault is a minimalist, focused digital solution for building and maintaining daily habits. Designed to help users achieve consistency, HabitVault provides a distraction-free environment for tracking progress, visualizing streaks, and gaining insights into personal productivity. The platform emphasizes clarity, emotional rewards, and a seamless user experience across devices.

## 🎯 Mission
To deliver a robust fullstack application that empowers users to:
- Add, manage, and track personal habits
- Check off completed habits each day
- Maintain streaks and view completion heatmaps
- Visualize performance and analytics over time
- Persist user settings locally for a personalized experience

## 👥 User Framework
HabitVault operates on a single-user model (authenticated user), with all data and preferences scoped to the logged-in user.

## 🔐 Security Framework
- Secure registration and login via email/password
- Persistent authentication across sessions
- Route protection for all habit and analytics data
- All habit data and user preferences are private and accessible only to the authenticated user

## 📝 Feature Set

### 1. Habit Management
- **Add Habit:** Create new habits with a name, target days (e.g., Every Day, Weekdays, Custom), and start date
- **Edit/Delete Habit:** Modify or remove habits at any time
- **Unique Habit Cards:** Each habit is displayed in a visually distinct card/grid view

### 2. Daily Check-In System
- **Mark Completion:** Check off habits as completed or missed for each day
- **Status Logging:** Each check-in is timestamped
- **Today's Habits:** View and toggle all habits for the current day
- **Inline Feedback:** Visual indicators (✅/❌ or checkbox) for completion status

### 3. Streaks & Progress
- **Current Streak:** Track consecutive days a habit is completed
- **Longest Streak:** Display the longest streak achieved for each habit
- **Streak Reset:** Missing a day resets the current streak

### 4. Visual Habit History
- **Heatmap/Calendar View:** Visualize completed and missed days (green/red)
- **Navigation:** Switch between week/month views for detailed history

### 5. Analytics Dashboard
- **Performance Visualizations:** Bar, pie, and line charts for:
  - Total habits created
  - Completion rate (e.g., 74% of all habit days completed)
  - Best-performing habit (by streak or completion rate)
- **Best Days Analysis:** Identify days with highest completion rates
- **Clean, Responsive UX:** Optimized for both desktop and mobile

### 6. Local Storage Features
- **Dark Mode Preference:** Persisted across sessions
- **Analytics Time Range:** Last selected range (week/month) is remembered
- **Motivational Quote Toggle:** Daily quote display preference is saved

### 7. Daily Motivational Quote
- **Rotating Quotes:** Static set or fetched from a public API
- **Date-Based Rotation:** New quote shown each day on the dashboard

### 8. UI/UX Considerations
- **Mobile-First Design:** Fully responsive, with special attention to mobile check-ins and analytics
- **Friendly Empty States:** Clear guidance when no habits are added
- **Accessible & Intuitive:** Simple, modern, and easy to use

## 🛠 Technical Architecture

### 🏗 System Design
- **Frontend:** React + TypeScript (Vite)
- **State Management:** Context API
- **Styling:** Tailwind CSS, shadcn-ui
- **Backend:** Supabase (authentication, database, storage)
- **Data Fetching:** React Query

### 📦 Technology Stack
- React, TypeScript, Tailwind CSS, shadcn-ui, Supabase, React Query

### 📁 Code Organization
- `src/pages/`: Application views (Dashboard, Analytics, Calendar, etc.)
- `src/components/`: Reusable UI elements (HabitCard, QuoteCard, etc.)
- `src/contexts/`: State management (AuthContext, HabitContext)
- `src/lib/`: Core utilities (local storage, helpers)
- `src/types/`: Type definitions
- `src/utils/`: Helper functions

### 🔄 System Flow
- **Data Management:** React Query for Supabase integration
- **User Interaction:** Real-time updates and local persistence

### 📊 Data Structure
- **User:** id, email, preferences, createdAt
- **Habit:** id, name, targetDays, startDate, completedDates, streaks, userId
- **Quote:** id, text, author

### 🔗 API Structure
- **Authentication:**
  - `/auth/signup`: Register new user
  - `/auth/signin`: User login
- **Habits:**
  - `/habits`: Create, update, delete, fetch habits
  - `/habits/:id`: Manage specific habit
- **Analytics:**
  - `/analytics/summary`: Habit and completion stats
  - `/analytics/best-days`: Best day analysis

## 🚀 Launch Instructions
- **Development:**  
  ```sh
  npm install
  npm run dev
  ```
- **Production:**  
  Deploy via your preferred platform (e.g., Vercel, Netlify, or Supabase hosting)

## 📝 Summary
HabitVault is your companion for building lasting habits, offering a clean, secure, and visually engaging experience. Whether you're tracking one habit or many, HabitVault helps you stay consistent and motivated every day.

---

We welcome your feedback and contributions! For support or inquiries, please contact the project maintainers.

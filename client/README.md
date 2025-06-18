# Task Management System - Frontend

This project is the frontend implementation of a comprehensive Task Management System built with React and Vite.

## Features

-  **Authentication System**

   -  User login with JWT
   -  Role-based access control (Admin/Team Member)
   -  Password management

-  **Admin Dashboard**

   -  Task creation and management
   -  User management
   -  Analytics and reporting
   -  Task statistics visualization

-  **Team Member Dashboard**

   -  View assigned tasks
   -  Update task status
   -  Add comments to tasks
   -  Calendar view for deadlines
   -  Profile management

-  **User Interface**
   -  Responsive design with Tailwind CSS
   -  Interactive charts with Chart.js
   -  Intuitive navigation
   -  Form validation

## Tech Stack

-  **React** - UI library
-  **Vite** - Build tool
-  **React Router** - Client-side routing
-  **Axios** - API communication
-  **Chart.js** - Data visualization
-  **Tailwind CSS** - Styling

## Project Structure

```
client/
├── public/                # Static files
├── src/
│   ├── assets/            # Images, icons, etc.
│   ├── components/        # Reusable components
│   │   ├── charts/        # Chart components
│   │   ├── common/        # Shared UI components
│   │   ├── forms/         # Form components
│   │   ├── layouts/       # Page layouts
│   │   ├── navigation/    # Navigation components
│   │   └── tasks/         # Task-related components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── auth/          # Authentication pages
│   │   └── member/        # Team member pages
│   ├── services/          # API service functions
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Root component
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── .eslintrc.js           # ESLint configuration
├── package.json           # Package dependencies
└── vite.config.js         # Vite configuration
```

## Getting Started

### Prerequisites

-  Node.js (v14.x or higher)
-  npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd task_management_system/client
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the client root directory (optional):

```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Build for production:

```bash
npm run build
# or
yarn build
```

### Default Credentials (Demo)

-  **Admin User**

   -  Email: admin@example.com
   -  Password: admin123

-  **Team Member**
   -  Email: team@example.com
   -  Password: team123

## Usage Notes

### Authentication

The application uses JWT tokens for authentication. The token is stored in localStorage and included in the Authorization header for API requests.

### Admin vs. Team Member

-  **Admin users** can create/edit tasks, manage users, and access analytics
-  **Team members** can only view and update their assigned tasks

## Development Guidelines

1. **Component Structure**

   -  Keep components small and focused
   -  Use custom hooks for shared logic
   -  Follow the container/presentation pattern

2. **Styling**

   -  Use Tailwind CSS utility classes
   -  Keep custom CSS to a minimum
   -  Use CSS variables for theme colors

3. **State Management**

   -  Use context for global state
   -  Use local state for component-specific data
   -  Leverage custom hooks for shared state logic

4. **Form Handling**

   -  Implement proper validation
   -  Show clear error messages
   -  Disable submit buttons during form submission

5. **Error Handling**
   -  Implement error boundaries
   -  Show user-friendly error messages
   -  Log errors to console in development

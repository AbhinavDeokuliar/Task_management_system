import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Auth pages
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import TaskManagement from './pages/admin/TaskManagement'
import UserManagement from './pages/admin/UserManagement'
import Analytics from './pages/admin/Analytics'

// Team member pages
import MemberDashboard from './pages/member/Dashboard'
import TasksList from './pages/member/TasksList'
import TaskDetail from './pages/member/TaskDetail'
import Calendar from './pages/member/Calendar'
import Profile from './pages/member/Profile'

// Shared layouts
import AdminLayout from './components/layouts/AdminLayout'
import MemberLayout from './components/layouts/MemberLayout'

// Error page
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/tasks" element={<TaskManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* Team member routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MemberLayout />}>
            <Route path="/dashboard" element={<MemberDashboard />} />
            <Route path="/tasks" element={<TasksList />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Redirect root to appropriate dashboard based on role */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
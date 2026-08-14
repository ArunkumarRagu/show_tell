import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { UserLayout } from '@/components/layouts/UserLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { LoginPage } from '@/pages/user/LoginPage';
import { DashboardPage } from '@/pages/user/DashboardPage';
import { ActivitiesPage } from '@/pages/user/ActivitiesPage';
import { ActivityDetailsPage } from '@/pages/user/ActivityDetailsPage';
import { ActiveActivityPage } from '@/pages/user/ActiveActivityPage';
import { ActivityResultPage } from '@/pages/user/ActivityResultPage';
import { HistoryPage } from '@/pages/user/HistoryPage';
import { LeaderboardPage } from '@/pages/user/LeaderboardPage';
import { ProfilePage } from '@/pages/user/ProfilePage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminTeamsPage } from '@/pages/admin/AdminTeamsPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminActivitiesPage } from '@/pages/admin/AdminActivitiesPage';
import { ActivityFormPage } from '@/pages/admin/ActivityFormPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminLogsPage } from '@/pages/admin/AdminLogsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import type { JSX } from 'react';

function ProtectedUser({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return <UserLayout>{children}</UserLayout>;
}

function ProtectedAdmin({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function PublicOnly({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnly><LoginPage /></PublicOnly>} />

      {/* User routes */}
      <Route path="/dashboard" element={<ProtectedUser><DashboardPage /></ProtectedUser>} />
      <Route path="/activities" element={<ProtectedUser><ActivitiesPage /></ProtectedUser>} />
      <Route path="/activities/:id" element={<ProtectedUser><ActivityDetailsPage /></ProtectedUser>} />
      <Route path="/activities/:id/run" element={<ProtectedUser><ActiveActivityPage /></ProtectedUser>} />
      <Route path="/activities/:id/result" element={<ProtectedUser><ActivityResultPage /></ProtectedUser>} />
      <Route path="/history" element={<ProtectedUser><HistoryPage /></ProtectedUser>} />
      <Route path="/leaderboard" element={<ProtectedUser><LeaderboardPage /></ProtectedUser>} />
      <Route path="/profile" element={<ProtectedUser><ProfilePage /></ProtectedUser>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedAdmin><AdminDashboardPage /></ProtectedAdmin>} />
      <Route path="/admin/teams" element={<ProtectedAdmin><AdminTeamsPage /></ProtectedAdmin>} />
      <Route path="/admin/users" element={<ProtectedAdmin><AdminUsersPage /></ProtectedAdmin>} />
      <Route path="/admin/activities" element={<ProtectedAdmin><AdminActivitiesPage /></ProtectedAdmin>} />
      <Route path="/admin/activities/new" element={<ProtectedAdmin><ActivityFormPage /></ProtectedAdmin>} />
      <Route path="/admin/activities/:id/edit" element={<ProtectedAdmin><ActivityFormPage /></ProtectedAdmin>} />
      <Route path="/admin/analytics" element={<ProtectedAdmin><AdminAnalyticsPage /></ProtectedAdmin>} />
      <Route path="/admin/logs" element={<ProtectedAdmin><AdminLogsPage /></ProtectedAdmin>} />
      <Route path="/admin/settings" element={<ProtectedAdmin><AdminSettingsPage /></ProtectedAdmin>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </AuthProvider>
  );
}


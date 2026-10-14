import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserLayout } from '@/components/layouts/UserLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';

// Page components
import { LoginPage } from '@/pages/user/LoginPage';
import { DashboardPage } from '@/pages/user/DashboardPage';
import { ActivitiesPage } from '@/pages/user/ActivitiesPage';
import { ActivityDetailsPage } from '@/pages/user/ActivityDetailsPage';
import { ActiveActivityPage } from '@/pages/user/ActiveActivityPage';
import { ActivityResultPage } from '@/pages/user/ActivityResultPage';
import { HistoryPage } from '@/pages/user/HistoryPage';
import { LeaderboardPage } from '@/pages/user/LeaderboardPage';
import { ProfilePage } from '@/pages/user/ProfilePage';

// Admin Page components
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminTeamsPage } from '@/pages/admin/AdminTeamsPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminActivitiesPage } from '@/pages/admin/AdminActivitiesPage';
import { ActivityFormPage } from '@/pages/admin/ActivityFormPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminLogsPage } from '@/pages/admin/AdminLogsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { BigScreenTimerPage } from '@/pages/admin/BigScreenTimerPage';

function FullPageSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0B1020]">
      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
    </div>
  );
}

function PublicLayoutComponent() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <FullPageSpinner />;
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return <Outlet />;
}

function ProtectedUserLayoutComponent() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/" replace />;
  return <UserLayout />;
}

function ProtectedAdminLayoutComponent() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <FullPageSpinner />;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return <AdminLayout />;
}

// 1. Root Route
export const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// 2. Public Layout & Login Route
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public-layout',
  component: PublicLayoutComponent,
});

const loginRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: LoginPage,
});

// 3. Protected User Layout & Sub-Routes
const userLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'user-layout',
  component: ProtectedUserLayoutComponent,
});

const dashboardRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const activitiesRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: '/activities',
  component: ActivitiesPage,
});

const activityDetailsRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: '/activities/$id',
  component: ActivityDetailsPage,
});

const activityRunRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: '/activities/$id/run',
  component: ActiveActivityPage,
});

const activityResultRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: '/activities/$id/result',
  component: ActivityResultPage,
});

const historyRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: '/history',
  component: HistoryPage,
});

const leaderboardRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
});

const profileRoute = createRoute({
  getParentRoute: () => userLayoutRoute,
  path: '/profile',
  component: ProfilePage,
});

// 4a. Bare admin route (no sidebar) — Big Screen Timer
function ProtectedAdminBareComponent() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <FullPageSpinner />;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}

const adminBareRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin-bare',
  component: ProtectedAdminBareComponent,
});

const adminTimerBigScreenRoute = createRoute({
  getParentRoute: () => adminBareRoute,
  path: '/admin/timer/bigscreen',
  component: BigScreenTimerPage,
});

// 4. Protected Admin Layout & Sub-Routes
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin-layout',
  component: ProtectedAdminLayoutComponent,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const adminTeamsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/teams',
  component: AdminTeamsPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/users',
  component: AdminUsersPage,
});

const adminActivitiesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/activities',
  component: AdminActivitiesPage,
});

const adminNewActivityRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/activities/new',
  component: ActivityFormPage,
});

const adminEditActivityRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/activities/$id/edit',
  component: ActivityFormPage,
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/analytics',
  component: AdminAnalyticsPage,
});

const adminLogsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/logs',
  component: AdminLogsPage,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/settings',
  component: AdminSettingsPage,
});

// Combine all routes into single route tree
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([loginRoute]),
  userLayoutRoute.addChildren([
    dashboardRoute,
    activitiesRoute,
    activityDetailsRoute,
    activityRunRoute,
    activityResultRoute,
    historyRoute,
    leaderboardRoute,
    profileRoute,
  ]),
  adminBareRoute.addChildren([
    adminTimerBigScreenRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminTeamsRoute,
    adminUsersRoute,
    adminActivitiesRoute,
    adminNewActivityRoute,
    adminEditActivityRoute,
    adminAnalyticsRoute,
    adminLogsRoute,
    adminSettingsRoute,
  ]),
]);

export const appRouter = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

export function AppRouterView() {
  return <RouterProvider router={appRouter} />;
}

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import '@/App.css';
import { Layout } from '@/pages/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { HomePage } from '@/pages/HomePage';
import { Room } from '@/pages/RoomPage';
import { FriendPage } from '@/pages/FriendPage';
import { SettingPage } from '@/pages/SettingPage';
import { MyRoomPage } from '@/pages/MyRoomPage';
import { PasswordResetPage } from '@/pages/PasswordResetPage';
import { SearchPage } from '@/pages/SearchPage';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { useUserStore } from './stores/useUserStore';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useUserStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SentryRoutes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route
              path="my-room"
              element={
                <ProtectedRoute>
                  <MyRoomPage />
                </ProtectedRoute>
              }
            />
            <Route path="room" element={<Room />} />
            <Route
              path="friend"
              element={
                <ProtectedRoute>
                  <FriendPage />
                </ProtectedRoute>
              }
            />
            <Route path="search" element={<SearchPage />} />
            <Route
              path="setting"
              element={
                <ProtectedRoute>
                  <SettingPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/*" element={<NotFoundPage />} />
        </SentryRoutes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

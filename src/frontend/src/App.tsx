import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import '@/App.css';
import { Layout } from '@/pages/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { HomePage } from '@/pages/HomePage';
import { Room } from '@/pages/room';
import { FriendPage } from '@/pages/FriendPage';
import { SettingPage } from '@/pages/SettingPage';
import { MyRoomPage } from '@/pages/MyRoomPage';
import { PasswordResetPage } from '@/pages/PasswordResetPage';

function App() {
  const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

  return (
    <BrowserRouter>
      <SentryRoutes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="." element={<HomePage />} />
          <Route path="my-room" element={<MyRoomPage />} />
          <Route path="room" element={<Room />} />
          <Route path="friend" element={<FriendPage />} />
          <Route path="setting" element={<SettingPage />} />
        </Route>
        <Route path="/*" element={<NotFoundPage />} />
      </SentryRoutes>
    </BrowserRouter>
  );
}

export default App;

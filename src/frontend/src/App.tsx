import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import '@/App.css';
import { Layout } from '@/pages/Layout1';
import { LoginPage } from '@/pages/LoginPage1';
import { RegisterPage } from '@/pages/RegisterPage1';
import { NotFoundPage } from '@/pages/NotFoundPage1';
import { HomePage } from '@/pages/HomePage1';
import { Room } from '@/pages/room';
import { FriendPage } from '@/pages/FriendPage1';
import { SettingPage } from '@/pages/SettingPage1';
import { MyRoomPage } from '@/pages/MyRoomPage1';

function App() {
  const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

  return (
    <BrowserRouter>
      <SentryRoutes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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

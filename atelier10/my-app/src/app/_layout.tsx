import NotificationsList from "@/components/NotificationsList";
import NotificationContextProvider from "@/contexts/Notification/NotificationContextProvider";
import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <NotificationContextProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <NotificationsList />
    </NotificationContextProvider>
  );
};

export default RootLayout;

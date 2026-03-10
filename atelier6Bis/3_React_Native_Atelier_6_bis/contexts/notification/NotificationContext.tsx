import React, { createContext, useContext, useState, ReactNode } from "react";

type NotificationType = "success" | "error" | "info";

export type Notification = {
  message: string;
  type: NotificationType;
} | null;

type NotificationContextValue = {
  notification: Notification;
  showNotification: (n: { message: string; type?: NotificationType; timeoutMs?: number }) => void;
  clearNotification: () => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification>(null);

  const clearNotification = () => setNotification(null);

  const showNotification = ({ message, type = "info", timeoutMs = 3000 }: { message: string; type?: NotificationType; timeoutMs?: number }) => {
    setNotification({ message, type });
    if (timeoutMs > 0) {
      setTimeout(() => setNotification(null), timeoutMs);
    }
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
};

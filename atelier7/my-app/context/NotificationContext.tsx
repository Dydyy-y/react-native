export type NotificationType = 'success' | 'error' | 'info';

export type Notification = {
  id: string;
  message: string;
  type: NotificationType;
};

export type NotificationContextType = {
  notifications: Notification[];
  showNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
};

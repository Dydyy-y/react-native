import { NotificationType } from "@/types/notification.type";

export interface AddNotificationAction {
  type: "ADD_NOTIFICATION";
  payload: Omit<NotificationType, "id" | "createdAt">;
}

export interface RemoveNotificationAction {
  type: "REMOVE_NOTIFICATION";
  payload: string; // Id of the notification to remove
}

export interface ClearNotificationsAction {
  type: "CLEAR_NOTIFICATIONS";
  payload?: string[]; // Optional array of notification IDs to clear, if not provided, all notifications will be cleared
}

export type NotificationAction =
  | AddNotificationAction
  | RemoveNotificationAction
  | ClearNotificationsAction;

const notificationReducer = (
  notifications: NotificationType[] = [],
  action: NotificationAction,
) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      const newNotification = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      return [...notifications, newNotification];
    case "REMOVE_NOTIFICATION":
      return notifications.filter(({ id }) => id !== action.payload);
    case "CLEAR_NOTIFICATIONS":
      return action.payload
        ? notifications.filter(({ id }) => !action.payload?.includes(id))
        : [];
    default:
      return notifications;
  }
};

export default notificationReducer;

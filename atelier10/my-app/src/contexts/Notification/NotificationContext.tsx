import { ActionDispatch, createContext } from "react";
import { NotificationType } from "@/types/notification.type";
import { NotificationAction } from "@/contexts/Notification/notificationReducer";

export interface NotificationContextType {
  notifications: NotificationType[];
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
});
export const NotificationDispatchContext = createContext<ActionDispatch<
  [action: NotificationAction]
> | null>(null);

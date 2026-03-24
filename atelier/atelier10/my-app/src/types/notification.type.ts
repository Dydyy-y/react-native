export type NotificationLevel = "success" | "info" | "warning" | "error";

export interface NotificationType {
  id: string;
  message: string;
  level: NotificationLevel;
  createdAt: Date;
}

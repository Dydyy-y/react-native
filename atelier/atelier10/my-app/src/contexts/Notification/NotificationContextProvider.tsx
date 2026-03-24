import notificationReducer from "@/contexts/Notification/notificationReducer";
import { ReactNode, useReducer } from "react";
import {
  NotificationContext,
  NotificationDispatchContext,
} from "./NotificationContext";

export interface NotificationContextProviderProps {
  children: ReactNode;
}

const NotificationContextProvider = ({
  children,
}: NotificationContextProviderProps) => {
  const [notifications, dispatchNotificationAction] = useReducer(
    notificationReducer,
    [],
  );

  console.log("Render NotificationContextProvider");

  return (
    <NotificationContext.Provider value={{ notifications }}>
      <NotificationDispatchContext.Provider value={dispatchNotificationAction}>
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;

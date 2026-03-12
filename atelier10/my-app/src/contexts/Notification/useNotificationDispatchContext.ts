import { useContext } from "react";
import {
  NotificationContext,
  NotificationDispatchContext,
} from "./NotificationContext";

const useNotificationDispatchContext = () =>
  useContext(NotificationDispatchContext);

export default useNotificationDispatchContext;

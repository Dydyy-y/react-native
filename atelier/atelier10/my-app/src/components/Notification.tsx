import { NotificationType, NotificationLevel } from "@/types/notification.type";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface NotificationProps {
  notification: NotificationType;
  onPress?: () => void;
}

const variants: Record<NotificationLevel, ViewStyle> = {
  success: {
    backgroundColor: "#169a34",
  },
  info: {
    backgroundColor: "#1865bd",
  },
  warning: {
    backgroundColor: "#ffc107",
  },
  error: {
    backgroundColor: "#dc3545",
  },
};

const Notification = ({
  notification: { level, message },
  onPress,
}: NotificationProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, variants[level]]}
      onPress={onPress}
    >
      <Text style={styles.message}>{message}</Text>
    </TouchableOpacity>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    color: "#fff",
  },
  message: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

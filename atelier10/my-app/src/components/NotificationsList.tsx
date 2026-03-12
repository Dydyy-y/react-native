import useNotificationContext from "@/contexts/Notification/useNotificationContext";
import useNotificationDispatchContext from "@/contexts/Notification/useNotificationDispatchContext";
import { FlatList, StyleSheet, View } from "react-native";
import Notification from "./Notification";
import { useEffect, useRef } from "react";

const NotificationsList = () => {
  const { notifications } = useNotificationContext();
  const dispatchNotificationAction = useNotificationDispatchContext();

  const intervalRef = useRef<NodeJS.Timeout>(null);

  const handlePressNotification = (id: string) => {
    dispatchNotificationAction?.({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  const clearExpiredNotifications = () => {
    const expiresAfterMilliseconds = 10000;
    const expiredNotifications = notifications.filter(
      ({ createdAt }) =>
        createdAt.getTime() <= Date.now() - expiresAfterMilliseconds,
    );
    console.log("Notifications expirées : ", expiredNotifications);
    if (expiredNotifications.length === 0) return;

    dispatchNotificationAction?.({
      type: "CLEAR_NOTIFICATIONS",
      payload: expiredNotifications.map(({ id }) => id),
    });
  };

  useEffect(() => {
    if (notifications.length === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      return;
    }

    if (notifications.length > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        console.log("Suppresion des notifs expirées");
        clearExpiredNotifications();
      }, 1000);
    }
  }, [notifications]);

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <Notification
            notification={item}
            onPress={() => handlePressNotification(item.id)}
          />
        )}
        keyExtractor={({ id }) => id}
        contentContainerStyle={styles.contentContainer}
        inverted
      />
    </View>
  );
};

export default NotificationsList;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  contentContainer: {
    padding: 16,
  },
});

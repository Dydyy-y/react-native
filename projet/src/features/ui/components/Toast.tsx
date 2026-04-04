import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Toast as ToastItem, ToastType, useUI } from '../contexts/UIContext';
import { COLORS } from '../../../shared/utils/constants';

const TOAST_BG: Record<ToastType, string> = {
  success: COLORS.success,
  error: COLORS.error,
  info: COLORS.info,
};

const ToastNotification = ({ toast }: { toast: ToastItem }) => {
  const { hideToast } = useUI();
  return (
    <TouchableOpacity
      style={[styles.toast, { backgroundColor: TOAST_BG[toast.type] }]}
      onPress={() => hideToast(toast.id)}
      activeOpacity={0.9}
    >
      <Text style={styles.message}>{toast.message}</Text>
    </TouchableOpacity>
  );
};

/** Container global des notifications toast — à placer en overlay dans RootNavigator */
export const ToastContainer = () => {
  const { state } = useUI();
  if (state.toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {state.toasts.map((toast) => (
        <ToastNotification key={toast.id} toast={toast} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toast: {
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  message: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
});

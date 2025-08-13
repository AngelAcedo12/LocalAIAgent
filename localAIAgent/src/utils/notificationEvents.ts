import { NotificationType } from "../components/NotificationComponent";

export interface NotificationEvent {
  message: string;
  type: NotificationType;
  id?: string;
  timeDuration?: number;
}

export const NOTIFICATION_EVENT = "app:notification";

export const emitNotification = (notification: NotificationEvent) => {
  const event = new CustomEvent<NotificationEvent>(NOTIFICATION_EVENT, {
    detail: notification,
  });
  window.dispatchEvent(event);
};

// Helper functions para emitir diferentes tipos de notificaciones
export const showSuccess = (message: string, timeDuration = 3000) => {
  emitNotification({ message, type: "success", timeDuration });
};

export const showError = (message: string, timeDuration = 3000) => {
  emitNotification({ message, type: "error", timeDuration });
};

export const showWarning = (message: string, timeDuration = 3000) => {
  emitNotification({ message, type: "warning", timeDuration });
};

export const showInfo = (message: string, timeDuration = 3000) => {
  emitNotification({ message, type: "info", timeDuration });
};

export const showLoading = (message: string) => {
  emitNotification({ message, type: "loading" });
};

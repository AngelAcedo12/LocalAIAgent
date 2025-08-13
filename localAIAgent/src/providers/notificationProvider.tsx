import React, { createContext, useState, useEffect, useContext } from 'react';
import { NotificationProps } from '../components/NotificationComponent';
import { NOTIFICATION_EVENT, NotificationEvent } from '../utils/notificationEvents';

interface NotificationContextProps {
    notifications: NotificationProps[];
    addNotification: (notification: NotificationProps) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);

    useEffect(() => {
        const handleNotificationEvent = (event: CustomEvent<NotificationEvent>) => {
            const notification = event.detail;
            const id = notification.id || Math.random().toString(36).substr(2, 9);
            addNotification({ ...notification, id });
        };

        window.addEventListener(NOTIFICATION_EVENT, handleNotificationEvent as EventListener);

        return () => {
            window.removeEventListener(NOTIFICATION_EVENT, handleNotificationEvent as EventListener);
        };
    }, []);

    const addNotification = (notification: NotificationProps) => {
        setNotifications((prev) => [...prev, notification]);
    };

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useContexNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};


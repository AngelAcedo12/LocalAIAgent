import React, { createContext, useState, useEffect, useContext } from 'react';
import { NotificationProps } from '../components/notificationComponent';
interface NotificationContextProps {
    notifications: NotificationProps[];
    addNotification: (notification: NotificationProps) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);

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


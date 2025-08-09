import React, { useEffect } from 'react';
import { useContexNotification } from '../providers/notificationProvider';
import NotificationComponent from './notificationComponent';

export const NotificationContainer: React.FC = () => {
    const { notifications } = useContexNotification();

    useEffect(() => {

    }, [notifications]);


    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {notifications.map((notification) => (
                <NotificationComponent
                    key={notification.id}
                    {...notification}
                />
            ))}
        </div>
    );
};

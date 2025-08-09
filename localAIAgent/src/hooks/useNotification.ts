import { useContexNotification } from '../providers/notificationProvider';
import { v4 as uuidv4 } from 'uuid';
import { NotificationType } from '../components/notificationComponent';

interface BaseNotificationProps {
    message: string;
    duration?: number;
}

interface LoadingNotificationProps extends BaseNotificationProps {
    onComplete?: () => void;
    successMessage?: string;
    errorMessage?: string;
}

interface PromiseNotificationProps<T> extends LoadingNotificationProps {
    promise: Promise<T>;
}

export const useNotification = () => {
    const { addNotification, removeNotification } = useContexNotification();

    const createNotification = (message: string, type: NotificationType, duration?: number) => {
        const id = uuidv4();
        
        addNotification({
            id,
            message,
            type,
            timeDuration: duration
        });

        // Si no es loading, configuramos el auto-remove
        if (type !== 'loading' && duration) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    };

    const success = ({ message, duration = 3000 }: BaseNotificationProps) => {
        return createNotification(message, 'success', duration);
    };

    const error = ({ message, duration = 3000 }: BaseNotificationProps) => {
        return createNotification(message, 'error', duration);
    };

    const warning = ({ message, duration = 3000 }: BaseNotificationProps) => {
        return createNotification(message, 'warning', duration);
    };

    const info = ({ message, duration = 3000 }: BaseNotificationProps) => {
        return createNotification(message, 'info', duration);
    };

    const loading = ({ message, onComplete, successMessage, errorMessage }: LoadingNotificationProps) => {
        const id = createNotification(message, 'loading');
        
        return {
            complete: (customSuccessMessage?: string) => {
                removeNotification(id);
                const finalMessage = customSuccessMessage || successMessage;
                if (finalMessage) {
                    success({ message: finalMessage });
                }
                onComplete?.();
            },
            error: (customErrorMessage?: string) => {
                removeNotification(id);
                const finalMessage = customErrorMessage || errorMessage;
                if (finalMessage) {
                    error({ message: finalMessage });
                }
            }
        };
    };

    const promise = async <T>({ 
        promise, 
        message, 
        successMessage = "Operación completada con éxito", 
        errorMessage = "Ha ocurrido un error", 
        onComplete 
    }: PromiseNotificationProps<T>): Promise<T> => {
        const loadingNotif = loading({ message });
        
        try {
            const result = await promise;
            loadingNotif.complete(successMessage);
            onComplete?.();
            return result;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : errorMessage;
            loadingNotif.error(errorMsg);
            throw err;
        }
    };

    return {
        success,
        error,
        warning,
        info,
        loading,
        promise
    };
};

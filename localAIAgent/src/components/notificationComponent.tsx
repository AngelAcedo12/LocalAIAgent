import React from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'loading' | 'info';

export interface NotificationProps {
    message: string;
    id?: string;
    timeDuration?: number;
    type: NotificationType;
}

export default class NotificationComponent extends React.Component<NotificationProps, { visible: boolean; isLeaving: boolean }> {
    state = {
        visible: true,
        isLeaving: false
    };

    componentDidMount() {
        const { timeDuration, type } = this.props;
        // Si es loading, no aplicamos el timer automático
        if (timeDuration && type !== 'loading') {
            setTimeout(() => {
                this.startLeaveAnimation();
            }, timeDuration);
        }
    }

    startLeaveAnimation = () => {
        this.setState({ isLeaving: true });
        // Esperamos a que termine la animación de salida antes de ocultar
        setTimeout(() => {
            this.setState({ visible: false });
        }, 400); // Duración de la animación de salida
    }

    getNotificationClass() {
        const { type } = this.props;
        const { isLeaving } = this.state;
        const baseClass = 'notification transform transition-color duration-300 ease-in-out';

        const typeClasses = {
            success: 'bg-green-500 outline outline-2 outline-green-300 bg-opacity-60',
            error: 'bg-red-500 outline outline-2 outline-red-300 bg-opacity-60',
            warning: 'bg-yellow-500 outline outline-2 outline-yellow-300 bg-opacity-60',
            loading: 'bg-blue-500 outline outline-2 outline-blue-300 bg-opacity-60',
            info: 'bg-gray-500 outline outline-2 outline-gray-300 bg-opacity-60'
        };

        // Animación de entrada y salida
        const animationClass = isLeaving
            ? 'animate-notification-exit'
            : 'animate-notification-enter';

        return `${baseClass} ${typeClasses[type]} ${animationClass} text-white p-4 rounded-lg shadow-md flex items-center gap-2`;
    }

    render() {
        if (!this.state.visible) return null;

        const { type, message, id } = this.props;

        return (
            <div className={this.getNotificationClass()} id={id}>
                {type === 'loading' && (
                    <div className="animate-spin  rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
                {type === 'success' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {type === 'error' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                {type === 'warning' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                )}
                {message}
            </div>
        );
    }
}



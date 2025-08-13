import React from 'react'
import { onDownloadEvent } from '../libs/downloadEvents'
import "./styles/progressBar.css"
import DownloadIcon from './icons/DownloadIcon';

export default function DownloadNotification() {
    const [progress, setProgress] = React.useState(0);
    const [complete, setComplete] = React.useState(false);
    const [living, setLiving] = React.useState(false);
    const progressRef = React.useRef(0);
    const updateScheduled = React.useRef(false);

    const scheduleProgressUpdate = (newProgress: number) => {
        progressRef.current = newProgress;
        if (!updateScheduled.current) {
            updateScheduled.current = true;
            requestAnimationFrame(() => {
                setProgress(progressRef.current);
                updateScheduled.current = false;
            });
        }
    };

    // useEffect para subscribirse una sola vez a los eventos
    React.useEffect(() => {
        const unSub = onDownloadEvent((event) => {
            switch (event.detail.type) {
                case 'progress':
                    setLiving(true);
                    setComplete(false);
                    scheduleProgressUpdate(event.detail.progress || 0);
                    break;
                case 'complete':
                    setLiving(true);
                    setComplete(true);
                    requestAnimationFrame(() => {
                        setProgress(100);
                    });
                    break;
                case 'error':
                    setProgress(0);
                    break;
            }
        });
        return () => {
            unSub();
        };
    }, []);

    // useEffect para quitar la notificación 3s después de completarse la descarga
    React.useEffect(() => {
        if (complete) {
            const timer = setTimeout(() => {
                setLiving(false);
                setComplete(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [complete]);

    if (!living && !complete) {
        return null; // No active notification
    }

    return (
        <div className={"fixed bottom-0 left-0 right-0 m-2 w-fit justify-center align-middle items-center flex flex-col " + (living ? "animate-fade-in" : "animate-fade-out")}>
            <div className='flex flex-row items-center gap-2 bg-gray-800 text-white p-4 rounded-lg shadow-lg'>
                <DownloadIcon className='animate-pulse' height={30} width={30}></DownloadIcon>
                <div className='gap-2 flex flex-col'>
                    {progress < 100 ? (
                        <div className="progress-bar">
                            <div className="h-1 w-full bg-red-500 rounded-xl" style={{ width: `${progress}%` }}></div>
                        </div>
                    ) : (
                        <p>Descarga completa!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

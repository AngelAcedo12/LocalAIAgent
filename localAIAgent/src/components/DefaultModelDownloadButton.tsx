import { useEffect, useState } from 'react';
import { startDefaultDownload } from '../libs/downloadModels';
import { emitDownloadEvent, onDownloadEvent } from '../libs/downloadEvents';
import { emit } from 'process';
import DownloadIcon from './icons/DownloadIcon';
import appConfig from '../utils/appConfig';
import { ConfigManager } from '../libs/configManager';


export function DefaultModelDownloadButton() {
    const [isDownloading, setIsDownloading] = useState(false);


    useEffect(() => {
        console.log(appConfig.defaultModelIsDownloading)
        console.log(ConfigManager.getInstance().loadConfig().then(config => console.log(config)))
    }, [])


    const handleClick = async () => {
        try {
            setIsDownloading(true);
            await startDefaultDownload({
                onProgress: (modelId, progress) => {

                    emitDownloadEvent('progress', {
                        modelId,
                        progress
                    });
                },
                onComplete: (modelId, localPath) => {
                    emitDownloadEvent('complete', {
                        modelId,
                        localPath
                    });
                    setIsDownloading(false);
                },
                onError: (modelId, error) => {
                    console.error(`Error en la descarga: ${error}`);
                    emitDownloadEvent('error', {
                        modelId,
                        error
                    });
                    setIsDownloading(false);
                }
            });
        } catch (error) {
            console.error('Error al iniciar la descarga:', error);
            setIsDownloading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isDownloading}
            className="px-4 py-2 border-rose-500 border rounded-full p-2  animate-fade-up hover:bg-white mt-10 hover:text-black transition-all"
        >
            {isDownloading ? (
                <div className="flex justify-center items-center transition-all duration-500">
                    <DownloadIcon className="h-6 w-6" />
                </div>
            ) : (
                <div className="flex items-center transition-all duration-500">
                    <span>
                        Descargar modelo por defecto
                    </span>
                    <DownloadIcon className="h-6 w-6 ml-2" />
                </div>
            )}

        </button>
    );
}


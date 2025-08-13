import React from 'react';
import { useModelDownload } from '../hooks/useModelDownload';

interface DownloadButtonProps {
    modelId: number;
}

export function DownloadButton({ modelId }: DownloadButtonProps) {
    const { downloadModelById, isDownloading } = useModelDownload();

    const handleClick = async () => {
        try {
            await downloadModelById(modelId);
        } catch (error) {
            console.error('Error en la descarga:', error);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isDownloading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
        >
            {isDownloading ? 'Descargando...' : 'Descargar Modelo'}
        </button>
    );
}

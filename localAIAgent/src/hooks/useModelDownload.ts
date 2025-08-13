import { useState } from 'react';
import { downloadModel } from '../libs/downloadModels';
import { dbPromise } from '../libs/db';
import { Model } from '../core/models/Models';

export function useModelDownload() {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadModelById = async (modelId: number) => {
        try {
            if (!dbPromise) return;

            // Obtener información del modelo de la base de datos
            const [model] = await dbPromise.select<Model[]>(
                'SELECT * FROM models WHERE id = ?',
                [modelId]
            );

            if (!model) {
                throw new Error('Modelo no encontrado');
            }

            setIsDownloading(true);

            // Iniciar la descarga
            await downloadModel({
                modelId: model.id,
                url: model.url,
                filename: model.filename
            });

        } catch (error) {
            console.error('Error al descargar el modelo:', error);
            throw error;
        } finally {
            setIsDownloading(false);
        }
    };

    return {
        downloadModelById,
        isDownloading
    };
}

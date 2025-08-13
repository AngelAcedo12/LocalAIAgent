import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import initApp, { dbPromise } from '../libs/db';
import { useNotification } from '../hooks/useNotification';
import { checkConnection as checkDBConnection } from '../libs/checkConexion';
import { startDefaultDownload } from '../libs/downloadModels';
import { is_llama_running } from '../libs/invokellamaServer';

// Define the shape of our context data
interface DBCheckContextProps {
    isConnected: boolean;
    statusProgrees: boolean;
    checkConnection: () => Promise<void>;
}

// Create the context with default values
const DBCheckContext = createContext<DBCheckContextProps>({
    isConnected: false,
    statusProgrees: false,
    checkConnection: async () => {
        /* Default implementation does nothing */
    },
});

// Custom hook to easily access the DBCheckContext
export const useDBCheck = () => useContext(DBCheckContext);

// Provider component that handles the connection check
export const DBCheckProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [statusProgrees, setStatusProgrees] = useState(false);
    const notification = useNotification();

    const checkConnection = async () => {
        try {
            setStatusProgrees(true);
            const loader = notification.loading({ message: 'Checking DB connection...' });

            const isConnected = await checkDBConnection();

            if (isConnected) {
                setIsConnected(true);
                loader.complete('DB connection successful');
                await initApp(); // Initialize the app if connection is successful


                // await startDefaultDownload();
            } else {
                setIsConnected(false);
                loader.error('DB connection failed');
            }
        } catch (err) {
            setIsConnected(false);
            notification.error({
                message: 'DB connection error: ' + (err instanceof Error ? err.message : 'Unknown error')
            });
            console.error('DB connection error:', err);
        } finally {
            setStatusProgrees(false);
        }
    };

    // Check connection when component mounts
    useEffect(() => {
        checkConnection();
    }, []);

    return (
        <DBCheckContext.Provider value={{ isConnected, statusProgrees, checkConnection }}>
            {children}
        </DBCheckContext.Provider>
    );
};




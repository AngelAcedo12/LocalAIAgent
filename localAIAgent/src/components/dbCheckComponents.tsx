import React, { useEffect } from 'react'
import { useDBCheck } from '../providers/dbCheckContext';
import Loader from './loader';
import { checkConnection } from '../libs/checkConexion';
import { useNotification } from '../hooks/useNotification';

export default function BbCheckNotify() {


    return (
        <div className='absolute top-0 left-0 p-4  '>

            {/* {statusProgrees ? <Loader /> : ''} */}
            {/* {isConnected ? 'Connected to DB' : 'Not connected to DB'} */}
        </div>
    )
}

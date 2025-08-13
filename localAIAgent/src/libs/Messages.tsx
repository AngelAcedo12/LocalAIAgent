import React, { ReactElement } from 'react'
import { Role } from '../hooks/useLocalLLM';

type MessajeProps = {
    content: string;
    user: Role;
    reply?: boolean;
    text?: string

}

export default function Messages({ content, user, reply, text }: MessajeProps) {

    const classBot = "md:px-2 rounded-md text-black mt-2 flex flex-col w-auto items-start  "
    const classUser = "md:px-2 rounded-md    mt-2 flex flex-col w-auto  items-end "
    const messageUserClass = " bg-zinc-800   w-fit text-end "
    const messageBotClass = "  w-fit"
    const messageClass = user == 'assistant' ? messageBotClass : messageUserClass



    if (reply != undefined) {
        return (
            <li className={user == "assistant" ? classBot : classUser}>
                <div className={'mt-2  p-2  md:px-4 rounded-lg animate-pulse' + messageClass}>
                    <strong className='text-rose-500'>{user == "assistant" ? "Escarlet" : 'User'}</strong>
                    <br />
                    <div className='max-w-full  text-slate-100' dir='auto'>
                        {content}
                    </div>
                </div>
            </li>
        )
    } else {
        return (
            <li className={user == "assistant" ? classBot : classUser}>
                <div className={'mt-2 p-2 md:px-4 rounded-lg animate-fade-up' + messageClass}>
                    <strong className='text-rose-500'>{user == "system" ? "Escarlet" : "User"}</strong>
                    <br />
                    <div className='max-w-full text-white' dir='auto'>
                        {content}
                    </div>
                    <div className='flex mt-2 w-full items-center'>
                        {text != undefined && user == 'system'}
                    </div>
                </div>
            </li>
        )
    }

}

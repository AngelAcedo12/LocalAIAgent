import React from 'react'
import { useChatContext } from '../providers/ChatContext';
import Messages from './Messages';

export default function ListMesage() {
    const { chat } = useChatContext();
    


    return (
        <div>
            {chat.messages.map((message, index) => (
                <div key={index} className="">
                    <Messages  content={message.content} user={message.role} />
                </div>
            ))}
        </div>
    )
}

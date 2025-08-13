import React from 'react'
import InputChat from '../../components/InputChat'
import LeftBar from '../../components/LeftBar'
import Navbar from '../../components/NavBar'
import Open_Navigation from '../../components/icons/Open_navigatiopn'
import { ChatProvider, useChatContext } from '../../providers/ChatContext'
import ListMesage from '../../libs/ListMesage'






export default function ChatPage(params: { conversationId?: string }) {
    const { conversationHook } = useChatContext();

    return (

        <div className='flex h-screen'>

            <LeftBar>

            </LeftBar>
            <div className='flex-1 flex flex-col p-4'>
                <div>
                    <div className='flex-row items-center gap-2 align-middle  mb-4 flex'>

                        {
                            conversationHook.openOrClose == false ? <div className='animate-fade  cursor-pointer hover:bg-zinc-800 transition-all  rounded-lg w-fit p-2' onClick={() => { conversationHook.open() }}>
                                <Open_Navigation className='fill-rose-500' width={24} height={24} />
                            </div> : null
                        }


                        <h1 className='text-2xl font-bold text-white '>Chat</h1>

                    </div>
                </div>

                <div className='flex-1 overflow-y-auto'>
                    <ListMesage></ListMesage>
                </div>
                <InputChat  ></InputChat>
            </div>


        </div>



    )
}

import React, { useEffect, useMemo, useState } from "react";

import useConversation from "../hooks/useConversation";
import useLocalLLM from "../hooks/useLocalLLM";


interface chatContextInteface {
    chat: ReturnType<typeof useLocalLLM>;
    conversationHook: ReturnType<typeof useConversation>;
    // voice : ReturnType<typeof useVoice>;
    isCompatible: boolean;
}

const chatContext = React.createContext<chatContextInteface>({
    chat: {} as ReturnType<typeof useLocalLLM>,
    conversationHook: {} as ReturnType<typeof useConversation>,
    // voice: {} as ReturnType<typeof useVoice>,
    isCompatible: false,
} as chatContextInteface);


export function ChatProvider({ children }: { children: React.ReactNode }) {
    const chat = useLocalLLM();
    const conversationHook = useConversation();
    // const voice = useVoice();
    const [isCompatible, setIsCompatible] = useState<boolean>(true);
    const [register, setRegister] = useState<boolean>(false);


    useEffect(() => {


    }, [])


    const value = useMemo(() => {
        return {
            chat,
            conversationHook,
            isCompatible,
            // voice

        }
    }, [chat, conversationHook])

    return <chatContext.Provider value={value}  > {children}</chatContext.Provider>
}

export function useChatContext() {
    const context = React.useContext(chatContext);

    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
}
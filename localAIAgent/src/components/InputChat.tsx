import { useEffect, useRef, useState } from 'react';
import useLocalLLM, { UseLocalLLMOptions } from '../hooks/useLocalLLM';
import { ConfigManager } from '../libs/configManager';
import { Loader_Triangle } from './loader_triangle';
import { useChatContext } from '../providers/ChatContext';
import SendIcon from './icons/SendIcon';

const getModelInConfig = async () => {
    return await ConfigManager.getInstance().getDefaultModel();
};

export default function InputChat() {
    const [isMultiLine, setIsMultiLine] = useState(false);
    const [message, setMessage] = useState("");
    const [baseHeight, setBaseHeight] = useState<number>(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { chat } = useChatContext();

    // Calcula la altura "de una línea" (line-height + paddings + bordes)
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;

        const cs = window.getComputedStyle(el);
        const lineHeight = parseFloat(cs.lineHeight);
        const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
        const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        const oneLineHeight = lineHeight + paddingY + borderY;

        setBaseHeight(oneLineHeight);
        el.style.height = `${oneLineHeight}px`;
    }, []);

    const handleUserMessage = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setMessage(e.currentTarget.value);
    };

    // Solo amplía cuando la primera línea se rompe (scrollHeight > baseHeight)
    const ajustarAltura = () => {
        const el = textareaRef.current;
        if (!el || !baseHeight) return;

        // Resetea a la altura base de 1 línea
        el.style.height = `${baseHeight}px`;

        if (el.value.trim().length === 0) {
            setIsMultiLine(false);
            return;
        }

        // Si el contenido sobrepasa una línea, ampliamos hasta el scrollHeight
        if (el.scrollHeight > baseHeight) {
            el.style.height = `${el.scrollHeight}px`;
            setIsMultiLine(true);
        } else {
            setIsMultiLine(false);
        }
    };

    const handleSend = async () => {
        if (!message.trim()) return;

        const opt: UseLocalLLMOptions = {
            model: await getModelInConfig(),
            baseURL: await ConfigManager.getInstance().getBaseURL(),
            stream: true,
        };

        chat.setOptions(opt);
        await chat.sendMessage(message);
        setMessage("");

        // Reset de altura a una línea y foco
        if (textareaRef.current && baseHeight) {
            textareaRef.current.style.height = `${baseHeight}px`;
            setIsMultiLine(false);
            textareaRef.current.focus();
        }
    };

    return (
        <div className="p-2 relative bottom-0 flex items-center h-min sm:justify-center">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                }}
                className={[
                    "max-sm:w-full p-5 py-2 w-1/2 gap-3 text-slate-100 flex flex-col",
                    // Transiciones suaves de borde, altura y background
                    "transition-[border-radius,height,background-color] duration-300 ease-in-out",
                    chat.isLoading ? "bg-transparent" : "bg-zinc-800",
                    isMultiLine
                        ? "min-h-[3rem] rounded-lg py-2 "   // menos redondo cuando se expande
                        : "min-h-[2rem] rounded-2xl"      // súper redondo en una línea
                ].join(" ")}
            >
                <div className="items-start flex w-full">
                    {chat.isLoading ? (
                        <div className="items-center flex justify-center w-full">
                            <Loader_Triangle />
                        </div>
                    ) : (
                        <textarea
                            ref={textareaRef}
                            value={message}
                            dir="auto"
                            onChange={(e) => {
                                handleUserMessage(e);
                                ajustarAltura();
                            }}
                            onInput={ajustarAltura}
                            disabled={chat.isLoading}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            tabIndex={0}
                            rows={1}
                            className="w-full p-2 max-h-60 resize-none bg-transparent min-h-[1.5rem] outline-none rounded-lg focus:outline-none disabled:animate-pulse text-wrap overflow-hidden transition-all duration-200 ease-in-out"
                            placeholder="Pregúntale a Escarlet AI"
                        />
                    )}
                </div>
                {chat.isLoading ? null : (
                    <div className='flex justify-end place-items-end w-full '>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="text-rose-500 self-end p-2 flex-row flex gap-3 
                              hover:bg-gray-950 rounded-lg transition-colors "
                            disabled={chat.isLoading}
                        >
                            <span className="text-rose-500 ">Enviar</span>
                            <SendIcon width={24} height={24} className="fill-red-600 " />
                        </button>
                    </div>

                )}
            </form>
        </div>
    );
}

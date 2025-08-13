import { useEffect, useState } from "react";

const useConversation = () => {
  // const [mapConversation, setMapConversation] = useState<chatConversationDay[]>([]);
  const [openOrClose, setOpenOrClose] = useState<boolean>(true);
  
  useEffect(() => {
    console.log(openOrClose);
  }, [openOrClose]);

  function changeStateOpenOrClose() {
    setOpenOrClose(!openOrClose);
  }

  function open() {
    setOpenOrClose(() => true);
  }
  function close() {
    setOpenOrClose(() => false);
  }
  return {
    openOrClose,
    changeStateOpenOrClose,
    open,
    close,
  };
};
export default useConversation;

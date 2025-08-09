import { useEffect, useState } from "react";

const useConversation = () => {
  // const [mapConversation, setMapConversation] = useState<chatConversationDay[]>([]);
  const [openOrClose, setOpenOrClose] = useState<boolean>(true);

  let storageEvent: StorageEvent;

  useEffect(() => {
    if (window) {
    }
  }, []);

  const changeStateOpenOrClose = () => {
    setOpenOrClose(!openOrClose);
  };

  return {
    openOrClose,
    changeStateOpenOrClose,
  };
};
export default useConversation;

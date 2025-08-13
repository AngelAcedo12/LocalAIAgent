import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DBCheckProvider } from "./providers/dbCheckContext";
import BbCheckNotify from "./components/dbCheckComponents";
import './global.css'
import { NotificationProvider } from "./providers/notificationProvider";

import { NotificationContainer } from "./components/NotificationContainer";

import DownloadNotification from "./components/DownloadNotification";
import { ChatProvider } from "./providers/ChatContext";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChatProvider>
      <NotificationProvider>
        <DBCheckProvider>
          <DownloadNotification />
          <NotificationContainer />
          <BbCheckNotify />
          <App />
        </DBCheckProvider>
      </NotificationProvider>
    </ChatProvider>

  </React.StrictMode>,
);


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DBCheckProvider } from "./providers/dbCheckContext";
import BbCheckNotify from "./components/dbCheckComponents";
import './global.css'
import { NotificationProvider } from "./providers/notificationProvider";
import NotificationComponent from "./components/notificationComponent";
import { NotificationContainer } from "./components/NotificationContainer";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NotificationProvider>
      <DBCheckProvider>
        <NotificationContainer />
        <BbCheckNotify />
        <App />
      </DBCheckProvider>
    </NotificationProvider>
  </React.StrictMode>,
);


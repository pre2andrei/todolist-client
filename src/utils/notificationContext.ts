import { createContext } from "react";

export interface Notification {
  message: string;
  type: NotificationType;
}

export enum NotificationType{
    ERROR,
    SUCCES
}

export const NotificationContext = createContext<{notification:Notification,setNotification:Function} | undefined>(undefined);

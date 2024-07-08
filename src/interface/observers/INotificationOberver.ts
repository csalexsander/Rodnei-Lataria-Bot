import { Client, GroupNotification } from "whatsapp-web.js";

export default interface INotificationObserver {
    Executar(comando: string, notification: GroupNotification, client: Client): void;
}
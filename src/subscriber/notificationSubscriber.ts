import { Client, GroupNotification } from "whatsapp-web.js";
import INotificationObserver from "../interface/observers/INotificationOberver";

export default class NotificationSubscriber {
    private readonly observers: INotificationObserver[];

    constructor() {
        this.observers = [];
    }

    CadastrarNotificationObservers(observer: INotificationObserver): void {
        this.observers.push(observer);
    }

    NotificarNotificationObservers(comando : string, message: GroupNotification, client: Client): void {
        if (!this.observers || this.observers.length === 0 || !comando)
            return;

        this.observers.forEach(observer => {
            try {
                observer.Executar(comando, message, client)
            }
            catch (e) {
                console.error(`[${observer.constructor.name}] Erro ao processar comando`, e);
            }
        });
    }
}
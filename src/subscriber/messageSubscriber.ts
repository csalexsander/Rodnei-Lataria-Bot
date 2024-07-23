import WAWebJS from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import UtilMessage from "../utils/utilMessage";
import ComandosConstantes from "../constantes/comandosConstantes";

export default class MessageSubscriber {
    private readonly ComandosObservers: IMessageObserver[];

    constructor() {
        this.ComandosObservers = [];
    }

    CadastrarMessageObservers(observer: IMessageObserver): void {
        this.ComandosObservers.push(observer);
    }

    NotificarMessageObservers(message: WAWebJS.Message, client: WAWebJS.Client): void {
        if (!this.ComandosObservers || this.ComandosObservers.length === 0)
            return;

        let comando = UtilMessage.ObterComando(message);

        if (!comando)
            comando = ComandosConstantes.mensagemRecebida;
        
        this.ComandosObservers.forEach(observer => {
            try {
                observer.Executar(comando, message, client)
            }
            catch (e) {
                console.error(`[${observer.constructor.name}] Erro ao processar comando`, e);
            }
        });
    }
}
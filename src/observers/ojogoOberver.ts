import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilString from "../utils/utilString";

// Se leu o nome ja perdeu kkkk
export default class OJogoObserver implements IMessageObserver {
    Executar(comando: string, message: Message, client: Client): void {
        if (!UtilString.compararString(comando, ComandosConstantes.jogo))
            return;

        client.sendMessage(message.from, "O JOGO!", { quotedMessageId: message.id._serialized });
    }
}
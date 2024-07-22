import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilString from "../utils/utilString";

export default class PiadaObserver implements IMessageObserver {
    Executar(comando: string, message: Message, client: Client): void {
        if (!UtilString.compararString(comando, ComandosConstantes.piada))
            return;

        client.sendMessage(message.from, "Você esperava um piu não é mesmo? Mas o botini morreu, supere isso.", { quotedMessageId: message.id._serialized });
    }
}
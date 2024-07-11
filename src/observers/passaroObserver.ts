import { Message, Client, MessageMedia } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilMatematica from "../utils/utilMatematica";

const comandos = [ComandosConstantes.passaro, ComandosConstantes.nomeCientifico]

export default class PassaroObserver implements IMessageObserver {
    Executar(comando: string, message: Message, client: Client): void {
        if (!comandos.some(x => x === comando))
            return;

        const numero = UtilMatematica.gerarNumeroAleatorio(1, 8);

        client.sendMessage(message.from, MessageMedia.fromFilePath(`src/assets/images/rolinha_${numero}.jpg`), { isViewOnce: true, quotedMessageId: message.id._serialized });
    }
}
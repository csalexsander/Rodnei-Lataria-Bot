import { Message, Client, MessageMedia } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilString from "../utils/utilString";

export default class SortearObserver implements IMessageObserver{
    Executar(comando: string, message: Message, client: Client): void {
        if (!UtilString.compararString(comando, ComandosConstantes.sortear))
            return;

        client.sendMessage(message.from, MessageMedia.fromFilePath(`src/assets/audio/sortear.mp3`), { quotedMessageId: message.id._serialized, mentions : message.mentionedIds });
    }

}
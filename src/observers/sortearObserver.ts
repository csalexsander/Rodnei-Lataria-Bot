import { Message, Client, MessageMedia } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilString from "../utils/utilString";

export default class SortearObserver implements IMessageObserver{
    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (!UtilString.compararString(comando, ComandosConstantes.sortear))
            return;

        const quotedMessage = await message.getQuotedMessage();

        client.sendMessage(message.from, MessageMedia.fromFilePath(`src/assets/audio/sortear.mp3`), { quotedMessageId: quotedMessage?.id?._serialized ?? message.id._serialized, mentions : message.mentionedIds });
    }
}
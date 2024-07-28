import { Message, Client, MessageMedia } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import UtilString from "../utils/utilString";
import ComandosConstantes from "../constantes/comandosConstantes";

export default class MarcosObserver implements IMessageObserver{
    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (!UtilString.compararString(comando, ComandosConstantes.marcos))
            return;

        const quotedMessage = await message.getQuotedMessage();

        client.sendMessage(message.from, MessageMedia.fromFilePath(`src/assets/audio/marcos.mp3`), { quotedMessageId: quotedMessage?.id?._serialized ?? message.id._serialized, mentions : message.mentionedIds });
    }
}
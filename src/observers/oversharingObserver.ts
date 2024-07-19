import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilString from "../utils/utilString";

export default class OversharingObserver implements IMessageObserver {
    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (!UtilString.compararString(comando, ComandosConstantes.overSharing))
            return;

        const quotedMessage = await message.getQuotedMessage();

        client.sendMessage(message.from, "NÃO DAR OVERSHARING, NÃO DAR OVERSHARING, NÃO DAR OVERSHARING", { quotedMessageId: quotedMessage?.id?._serialized ?? message.id._serialized });
    }
}
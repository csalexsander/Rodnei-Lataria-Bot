import { Client, MessageMedia, Message } from "whatsapp-web.js";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilString from "../utils/utilString";
import Contexto from "../database/context";
import IMessageObserver from "../interface/observers/IMessageObserver";

export default class StickerObserver implements IMessageObserver {
    
    constructor(contexto: Contexto) {
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        
        if (!UtilString.compararString(comando, ComandosConstantes.sticker))
            return;

        if (!message.hasQuotedMsg) {
            client.sendMessage(message.from, "⚠  Execute este comando respondando a uma mensagem com imagem.");
            return;
        }

        const quotedMsg = await message.getQuotedMessage();

        if (!quotedMsg.hasMedia){
            client.sendMessage(message.from, "⚠  A mensagem precisa ter uma imagem.");
            return;
        }

        const media = await quotedMsg.downloadMedia();

        if (quotedMsg.rawData.isViewOnce){
            client.sendMessage(message.from, "⚠  Não é possível fazer sticker de imagem de visualização única.");
            return;
        }

        client.sendMessage(message.from, media, { 
            sendMediaAsSticker: true, 
            stickerAuthor: '[Galerinha Bot]'
        });
    }

}
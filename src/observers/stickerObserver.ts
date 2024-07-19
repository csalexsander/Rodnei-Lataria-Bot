import { Client, MessageMedia, Message } from "whatsapp-web.js";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilString from "../utils/utilString";
import Contexto from "../database/context";
import IMessageObserver from "../interface/observers/IMessageObserver";

export default class StickerObserver implements IMessageObserver {
    
    constructor(contexto: Contexto) {
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        try {
                
            if (!UtilString.compararString(comando, ComandosConstantes.sticker))
                return;

            //Validação de uso correto do comando.
            if (!message.hasMedia && !message.hasQuotedMsg) {
                client.sendMessage(message.from, "⚠  Execute este comando junto ao envio de uma imagem, ou respondendo a uma mensagem com imagem.");
                return;
            }

            var media : MessageMedia | null = null;

            //Se for executado junto a uma mensagem com imagem
            if (message.hasMedia) {
                if (message.rawData.isViewOnce){
                    client.sendMessage(message.from, "⚠  Não é possível fazer sticker de imagem de visualização única.");
                    return;
                }

                media = await message.downloadMedia()
            }
            //Caso não for executado junto a uma imagem, confirma se está corretamente apontando para uma outra mensagem.
            else {
                const quotedMsg = await message.getQuotedMessage();

                if (!quotedMsg.hasMedia){
                    client.sendMessage(message.from, "⚠  A mensagem precisa ter uma imagem.");
                    return;
                }
                
                if (quotedMsg.rawData.isViewOnce){
                    client.sendMessage(message.from, "⚠  Não é possível fazer sticker de imagem de visualização única.");
                    return;
                }

                media = await quotedMsg.downloadMedia();
            }

            //Caso uma imagem tenha sido encontrada, envia como sticker.
            if (media != null) {
                client.sendMessage(message.from, media, { 
                    sendMediaAsSticker: true, 
                    stickerAuthor: '[Galerinha Bot]'
                });
            }
        }
        catch (e){
            console.log(e);
        }
    }

}
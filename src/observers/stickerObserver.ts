import { Client, MessageMedia, Message } from "whatsapp-web.js";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilString from "../utils/utilString";
import Contexto from "../database/context";
import IMessageObserver from "../interface/observers/IMessageObserver";
import UtilMensagemSticker from "../utils/utilMensagemSticker";

export default class StickerObserver implements IMessageObserver {
    constructor(contexto: Contexto) {
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
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

            if (quotedMsg.hasMedia) {
                if (quotedMsg.rawData.isViewOnce){
                    client.sendMessage(message.from, "⚠  Não é possível fazer sticker de imagem de visualização única.");
                    return;
                }

                media = await quotedMsg.downloadMedia();
            }

            if (!quotedMsg.hasMedia) {
                // Gera um sticker da mensagem

                const nivelMaximo = (n => n >= 1 && n <= 3 ? n : 3)(+message.body.replace(comando, '').trim()[0]);
                const arrayMensagens: { imagem: string; usuario: string; mensagem: string; horaMensagem: string }[] = [];

                let mensagemAtual = quotedMsg;
                let nivel = 1;

                while (mensagemAtual && mensagemAtual.body && nivel <= nivelMaximo) {
                    const fotoPerfilUrl = await client.getProfilePicUrl(mensagemAtual.author || mensagemAtual.from);
                    const contato = await client.getContactById(mensagemAtual.author || mensagemAtual.from);

                    const nomeUsuario = contato.pushname || contato.name || 'Desconhecido';
                    const corpoMensagem = mensagemAtual.body || '_Mensagem indisponível_';
                    const horaMensagem = '23:99'; // API maldita não retorna a hora certa

                    let processedMessage = corpoMensagem;
                    for (const mentionedId of mensagemAtual.mentionedIds) {
                      const contatoMencao = await client.getContactById(mentionedId._serialized);
                      const contatoMencaoNome = contatoMencao.pushname || contatoMencao.name || contatoMencao.number;
                      processedMessage = processedMessage.replace(new RegExp(`@${contatoMencao.number}`, 'g'), `<span style="color: lightblue">@${contatoMencaoNome}</span>`);
                    }

                    arrayMensagens.unshift({ imagem: fotoPerfilUrl, usuario: nomeUsuario, mensagem: processedMessage, horaMensagem });

                    mensagemAtual = await mensagemAtual.getQuotedMessage();
                    nivel++;
                }

                if (!arrayMensagens.length) {
                    client.sendMessage(message.from, "⚠  Não é possível fazer sticker com a mensagem informada.");
                    return;
                }

                const imagemRetornada = await UtilMensagemSticker.gerarImagem(arrayMensagens);
                media = new MessageMedia('image/png', imagemRetornada.toString('base64'));
            }
        }

        //Caso uma imagem tenha sido encontrada, envia como sticker.
        if (media != null) {
            client.sendMessage(message.from, media, {
                sendMediaAsSticker: true,
                stickerAuthor: '[Galerinha Bot]'
            });
        }
    }
}

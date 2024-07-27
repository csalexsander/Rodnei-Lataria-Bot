import { Message, Client, GroupChat } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import ComandosConstantes from "../constantes/comandosConstantes";
import SorteioService from "../service/sorteioService";
import UtilChat from "../utils/utilChat";
import UtilMessage from "../utils/utilMessage";
import UtilString from "../utils/utilString";
import { labels } from "../constantes/uiConstantes";

export default class SorteioObserver implements IMessageObserver {

    private readonly sorteioService: SorteioService;

    constructor() {
        this.sorteioService = new SorteioService();
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (!UtilString.compararString(comando, ComandosConstantes.sorteio))
            return;

        const chat = await message.getChat();

        if (!chat)
            return;

        if (!UtilChat.EhChatGrupo(chat)) {
            client.sendMessage(message.from, labels.erro.apenasGrupo, {quotedMessageId: message.id._serialized});
            return;
        }

        const requisitante = chat.participants.find(x => x.id._serialized === message.author);
        if (!requisitante)
            return;

        if (!requisitante.isAdmin) {
            await client.sendMessage(message.from, "Apenas administratores podem utilizar esse comando. Evolua", {quotedMessageId: message.id._serialized});
            return;
        }

        let corpoMensagem = UtilMessage.ObterCorpoMensagem(message);

        let quantidadePremioSorteio = this.sorteioService.obterDadosSorteioCorpoMensagem(corpoMensagem);

        const contatosSorteados = this.sorteioService.sortearMembroGrupo(chat, quantidadePremioSorteio.quantidade);

        if (!contatosSorteados || !contatosSorteados.length || contatosSorteados.length === 0)
            return;

        const numeros = contatosSorteados.map(x => x.id.user);
        const idInterno = contatosSorteados.map(x => x.id._serialized);

        const singularPlural = numeros.length > 1 ? "vocês foram sorteados, e ganharam o premio:" : "você foi sorteado, e ganhou o premio:";

        client.sendMessage(message.from, `Parabens @${numeros.join(", @")} ${singularPlural} ${quantidadePremioSorteio.premio}`, { mentions: [...idInterno, ...message.mentionedIds], quotedMessageId: message.id._serialized });
    }

}
import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../../interface/observers/IMessageObserver";
import PerfilRepository from "../../repositorios/perfilRepository";
import Contexto from "../../database/context";
import ComandosConstantes from "../../constantes/comandosConstantes";
import UtilChat from "../../utils/utilChat";
import PerfilViewRepository from "../../repositorios/perfilViewRepository";
import { labels } from "../../constantes/uiConstantes";

export default class PerfisObserver implements IMessageObserver {

    private repositorio: PerfilRepository;
    private repositorioView: PerfilViewRepository;

    constructor(contexto: Contexto) {
        this.repositorio = new PerfilRepository(contexto);
        this.repositorioView = new PerfilViewRepository(contexto);
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (comando != ComandosConstantes.perfis)
            return;

        const chat = await message.getChat();

        if (!chat)
            return;

        if (UtilChat.EhChatGrupo(chat)) {
            await client.sendMessage(message.from, labels.erro.privadoBot, { quotedMessageId: message.id._serialized });
            return;
        }

        const contato = await message.getContact();

        if (!contato || !contato.id._serialized)
            return;

        const perfis = await this.repositorio.obterTodosNomesPerfis();

        if (!perfis || !perfis.length || perfis.length <= 0)
            return;

        let mensagem = labels.perfis.idPessoa;

        mensagem += perfis.map((nome, index) => `${index + 1} - ${nome} `).join("\n");

        const mensagemEnviada = await client.sendMessage(message.from, mensagem);

        this.repositorioView.upInsert(contato.id._serialized, mensagemEnviada.id._serialized);
    }

}
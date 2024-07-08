import { Message, Client, Contact } from "whatsapp-web.js";
import IMessageObserver from "../../interface/observers/IMessageObserver";
import ComandosConstantes from "../../constantes/comandosConstantes";
import UtilChat from "../../utils/utilChat";
import PerfilRepository from "../../repositorios/perfilRepository";
import Contexto from "../../database/context";
import Perfil from "../../entidades/perfil";
import TipoPreenchimentoPerfil from "../../constantes/tipoPreenchimentoPerfil";

export default class PerfilObserver implements IMessageObserver {

    private repositorio: PerfilRepository;

    constructor(contexto: Contexto) {
        this.repositorio = new PerfilRepository(contexto);
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (comando !== ComandosConstantes.perfil)
            return;

        const chat = await message.getChat();

        if (!chat)
            return;

        if (UtilChat.EhChatGrupo(chat)) {
            await client.sendMessage(message.from, "Este comando somente funciona no privado do bot", { quotedMessageId: message.id._serialized });
            return;
        }

        const contato = await message.getContact();

        if (!contato || !contato.id._serialized)
            return;

        const perfil = await this.repositorio.obterPerfilContato(contato.id._serialized);

        if (!perfil)
            this.CriarPerfil(message.from, contato, client);
        else
            this.EditarPerfil(message.from, perfil, client);
    }

    async CriarPerfil(chatId: string, contato: Contact, client: Client): Promise<void> {
        await client.sendMessage(chatId, "Iremos solicitar algumas informações para criar o seu perfil, caso não se sinta confortavel em preencher alguma informação, responda a respectiva mensagem com 'Não Quero Informar' (sem aspas)");
        const message = await client.sendMessage(chatId, "Informe o seu Nome");

        const perfil = new Perfil(contato.id._serialized, contato.id.user, message.id._serialized, TipoPreenchimentoPerfil.nome, null, null, null, null, null, null, null, null);

        await this.repositorio.salvarPerfilContato(perfil);
    }

    async EditarPerfil(chatId: string, perfil: Perfil, client: Client): Promise<void> {
        await client.sendMessage(chatId, Perfil.obterResumoPerfil(perfil));

        const mensagemEdicao = await client.sendMessage(chatId, Perfil.ObterOpcoesEdicao());

        await this.repositorio.atualizarMessageSerializedTipoPreenchimento(mensagemEdicao.id._serialized, perfil.contactSerialized, TipoPreenchimentoPerfil.completo);
    }
}
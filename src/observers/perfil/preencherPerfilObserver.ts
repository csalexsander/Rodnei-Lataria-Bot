import { Message, Client, Contact } from "whatsapp-web.js";
import IMessageObserver from "../../interface/observers/IMessageObserver";
import PerfilRepository from "../../repositorios/perfilRepository";
import Contexto from "../../database/context";
import UtilChat from "../../utils/utilChat";
import TipoPreenchimentoPerfil from "../../constantes/tipoPreenchimentoPerfil";
import ComandosConstantes from "../../constantes/comandosConstantes";
import moment from "moment";
import UtilString from "../../utils/utilString";
import Perfil from "../../entidades/perfil";

export default class PreencherPerfilObserver implements IMessageObserver {

    private repositorio: PerfilRepository;

    constructor(contexto: Contexto) {
        this.repositorio = new PerfilRepository(contexto);
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        
        if (!UtilString.compararString(comando, ComandosConstantes.mensagemRecebida))
            return;

        const chat = await message.getChat();

        if (!chat)
            return;

        if (UtilChat.EhChatGrupo(chat)) {
            return;
        }

        const contato = await message.getContact();

        if (!contato || !contato.id._serialized)
            return;

        const quotedMessage = await message.getQuotedMessage();

        if (!quotedMessage)
            return;

        const perfil = await this.repositorio.obterPerfilContatoMensagem(contato.id._serialized, quotedMessage.id._serialized);

        if (!perfil)
            return;

        if (perfil.tipoPreenchimento === TipoPreenchimentoPerfil.completo) {
            this.EditarPerfil(message.body, message.from, contato, client);
            return;
        }

        let valor = message.body;
        if (perfil.tipoPreenchimento === TipoPreenchimentoPerfil.nascimento)
            valor = moment(valor, "DD/MM/YYYY").format();

        const proximoTipo = perfil.isEdit ? TipoPreenchimentoPerfil.completo : TipoPreenchimentoPerfil.obterProximaEtapa(perfil.tipoPreenchimento);

        if (proximoTipo != TipoPreenchimentoPerfil.completo)
            await this.AtualizarPerfil(valor, perfil.tipoPreenchimento, TipoPreenchimentoPerfil.obterMensagemPreenchimento(proximoTipo), proximoTipo, message.from, contato, client);
        else
            await this.CompletarPerfil(valor, perfil.tipoPreenchimento, proximoTipo, message.from, contato, client);
    }

    async AtualizarPerfil(valor: string, tipoValor: string, mensagem: string, tipoPreenchimento: string, chatId: string, contato: Contact, client: Client): Promise<void> {
        const message = await client.sendMessage(chatId, mensagem);

        await this.repositorio.atualizarParteContato(message.id._serialized, contato.id._serialized, tipoPreenchimento, tipoValor, valor);
    }

    async CompletarPerfil(valor: string, tipoValor: string, tipoPreenchimento: string, chatId: string, contato: Contact, client: Client): Promise<void> {

        await this.repositorio.atualizarParteContato(null, contato.id._serialized, tipoPreenchimento, tipoValor, valor);

        const perfil = await this.repositorio.obterPerfilContato(contato.id._serialized);

        if (!perfil)
            return;

        client.sendMessage(chatId, Perfil.obterResumoPerfil(perfil));
    }

    async EditarPerfil(opcao: string, chatId: string, contato: Contact, client: Client): Promise<void> {
        const opcaoNumber = parseInt(opcao);

        if (isNaN(opcaoNumber)) {
            await client.sendMessage(chatId, "Opção invalida, responda a mesma mensagem com apenas o numero das opções informada.");
            return;
        }

        const opcaoSelecionada = TipoPreenchimentoPerfil.edicaoPerfilOpcoes[opcaoNumber - 1];

        if (!opcaoSelecionada) {
            await client.sendMessage(chatId, "Opção invalida, responda a mesma mensagem uma das opções informadas.");
            return;
        }

        const mensagem = await client.sendMessage(chatId, TipoPreenchimentoPerfil.obterMensagemPreenchimento(opcaoSelecionada));

        await this.repositorio.atualizarEtapaEdicao(mensagem.id._serialized, contato.id._serialized, opcaoSelecionada, true, TipoPreenchimentoPerfil.completo);
    }
}
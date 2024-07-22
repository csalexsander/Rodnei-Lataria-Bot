import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../../interface/observers/IMessageObserver";
import PerfilRepository from "../../repositorios/perfilRepository";
import PerfilViewRepository from "../../repositorios/perfilViewRepository";
import Contexto from "../../database/context";
import ComandosConstantes from "../../constantes/comandosConstantes";
import UtilChat from "../../utils/utilChat";
import Perfil from "../../entidades/perfil";
import UtilString from "../../utils/utilString";

export default class PerfilViewObserver implements IMessageObserver{

    private repositorio: PerfilRepository;
    private repositorioView: PerfilViewRepository;

    constructor(contexto: Contexto) {
        this.repositorio = new PerfilRepository(contexto);
        this.repositorioView = new PerfilViewRepository(contexto);
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

        const perfilView = await this.repositorioView.obterPerfilView(contato.id._serialized);

        if(!perfilView || !perfilView.messageSerializes || perfilView.messageSerializes != quotedMessage.id._serialized)
            return;

        const opcaoSelecionada = parseInt(message.body);

        if(isNaN(opcaoSelecionada)){
            client.sendMessage(message.from, "Opção Invalida, deve ser informado apenas o numero da Pessoa selecionada. Responda a mesma mensagem novamente, com o numero do perfil desejado");
        }

        const perfis = await this.repositorio.listarTodosPerfilContato();
        if(!perfis)
            return;

        const perfil = perfis[opcaoSelecionada - 1];
        if(!perfil){
            await client.sendMessage(message.from, "Opção invalida, deve ser informada uma opção valida presentes na mensagem anterior, responda novamente com o Id desejado");
            return;
        }

        await client.sendMessage(message.from, Perfil.obterResumoPerfil(perfil))
    }
}
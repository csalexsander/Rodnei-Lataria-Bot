import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import Contexto from "../database/context";
import UtilChat from "../utils/utilChat";
import moment from "moment";
import MensagemRecebidaRepository from "../repositorios/mensagemRecebidaRepository";
import MensagemRecebida from "../entidades/mensagemRecebida";

export default class ContadorMsgObserver implements IMessageObserver {
    private repositorio: MensagemRecebidaRepository;

    constructor(contexto: Contexto) {
        this.repositorio = new MensagemRecebidaRepository(contexto);
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        const chat = await message.getChat();

        if (!chat)
            return;

        if (!UtilChat.EhChatGrupo(chat)) {
            return;
        }

        const contact = await client.getContactById(message.id.participant);

        if (!contact)
            return;

        const mensagemRecebida = new MensagemRecebida(message.id._serialized, contact.id.user, contact.id._serialized, chat.id._serialized, moment(message.timestamp * 1000).format());

        await this.repositorio.inserirMensagemRecebida(mensagemRecebida);
    }

}
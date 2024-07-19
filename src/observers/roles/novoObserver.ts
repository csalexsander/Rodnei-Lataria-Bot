import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../../interface/observers/IMessageObserver";
import RolesRepository from "../../repositorios/rolesRepository";
import Contexto from "../../database/context";
import ComandosConstantes from "../../constantes/comandosConstantes";
import Role from "../../entidades/role";
import RoleEtapaPreenchimento from "../../constantes/roleEtapaPreenchimento";
import { uuidv7 } from "uuidv7";
import UtilString from "../../utils/utilString";

export default class NovoObserver implements IMessageObserver {
    private repositorio: RolesRepository;

    constructor(contexto: Contexto) {
        this.repositorio = new RolesRepository(contexto);
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (!UtilString.compararString(comando, ComandosConstantes.novoRole))
            return;

        const contato = await message.getContact();

        if (!contato || !contato.id._serialized)
            return;

        const mensagem = await client.sendMessage(message.from, RoleEtapaPreenchimento.obterMensagemPreenchimento(RoleEtapaPreenchimento.nome), { quotedMessageId: message.id._serialized });

        const role = new Role(uuidv7(), contato.id._serialized, RoleEtapaPreenchimento.nome, mensagem.id._serialized);

        await this.repositorio.criarRole(role);
    }
}
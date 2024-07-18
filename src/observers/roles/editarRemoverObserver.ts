import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../../interface/observers/IMessageObserver";
import ComandosConstantes from "../../constantes/comandosConstantes";
import UtilMessage from "../../utils/utilMessage";
import RolesRepository from "../../repositorios/rolesRepository";
import Contexto from "../../database/context";
import UtilContato from "../../utils/UtilContato";
import Role from "../../entidades/role";
import RoleEtapaPreenchimento from "../../constantes/roleEtapaPreenchimento";

export default class EditarRemoverObserver implements IMessageObserver {
    private readonly comandos: string[] = [ComandosConstantes.editarRole, ComandosConstantes.removerRole];

    private repositorio: RolesRepository;

    constructor(contexto: Contexto) {
        this.repositorio = new RolesRepository(contexto);
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (!comando || !this.comandos.some(x => x === comando))
            return;

        const corpo = UtilMessage.ObterCorpoMensagem(message);
        if (!corpo) {
            client.sendMessage(message.from, "É necessário informar o ID do rolê", { quotedMessageId: message.id._serialized });
            return;
        }

        const sequencial = parseInt(corpo?.trim() ?? "");
        if (!sequencial || isNaN(sequencial)) {
            client.sendMessage(message.from, "Informe apenas o ID do rolê", { quotedMessageId: message.id._serialized });
            return;
        }

        const contato = await message.getContact();

        if (!contato || !contato.id._serialized)
            return;

        const chat = await message.getChat();

        if (!chat)
            return;

        let role = await this.repositorio.obterRolePorSequencial(sequencial.toString());

        if (!role) {
            client.sendMessage(message.from, `Não existe rolê de ID ${sequencial}`, { quotedMessageId: message.id._serialized });
            return;
        }

        if (role.contact_serialized != contato.id._serialized && !UtilContato.EhAdminGrupoDonoEvento(client, chat, message, role.contact_serialized)) {
            client.sendMessage(message.from, `Você não tem permissão para Editar ou Deletar o rolê de ID ${sequencial}`, { quotedMessageId: message.id._serialized });
            return;
        }

        switch (comando) {
            case ComandosConstantes.editarRole:
                await this.editarRole(role, sequencial, message, client);
                break;
            case ComandosConstantes.removerRole:
                await this.deletarRole(role, sequencial, message, client);
                break;
        }

    }

    async editarRole(role: Role, sequencial: number, message: Message, client: Client): Promise<void> {
        const mensagemEnviada = await client.sendMessage(message.from, Role.obterMensagemEdicaoRole(), { quotedMessageId: message.id._serialized });

        await this.repositorio.atualizarEtapaEdicaoRole(role.id, RoleEtapaPreenchimento.edicao, mensagemEnviada.id._serialized);
    }

    async deletarRole(role: Role, sequencial: number, message: Message, client: Client): Promise<void> {
        await this.repositorio.esconderRole(role.id);

        const roleEditado = await this.repositorio.obterRolePorSequencial(sequencial.toString());

        var mensagem = "Press F to Pay Respect for the Role";
        if (roleEditado?.is_visible ?? true)
            mensagem = "Falha ao remover o role";

        client.sendMessage(message.from, mensagem, { quotedMessageId: message.id._serialized });
    }
}
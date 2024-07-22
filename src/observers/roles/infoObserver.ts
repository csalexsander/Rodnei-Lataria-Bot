import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../../interface/observers/IMessageObserver";
import RolesRepository from "../../repositorios/rolesRepository";
import Contexto from "../../database/context";
import ComandosConstantes from "../../constantes/comandosConstantes";
import UtilMessage from "../../utils/utilMessage";
import Role from "../../entidades/role";
import PerfilRepository from "../../repositorios/perfilRepository";
import UtilString from "../../utils/utilString";

export default class InfoObserver implements IMessageObserver {
    private repositorio: RolesRepository;
    private perfilRepositorio: PerfilRepository;

    constructor(contexto: Contexto) {
        this.repositorio = new RolesRepository(contexto);
        this.perfilRepositorio = new PerfilRepository(contexto);
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (!UtilString.compararString(comando, ComandosConstantes.info))
            return;

        const corpo = UtilMessage.ObterCorpoMensagem(message);
        if (!corpo) {
            client.sendMessage(message.from, "É necessário informar o ID do rolê", { quotedMessageId: message.id._serialized });
            return;
        }

        const sequencial = parseInt(corpo?.trim() ?? "");
        if (!sequencial || isNaN(sequencial)) {
            client.sendMessage(message.from, "Informe apenas o ID do rolê que deseja procurar", { quotedMessageId: message.id._serialized });
            return;
        }

        const perfis = await this.perfilRepositorio.listarTodosPerfilContato();

        const role = await this.repositorio.obterRoleCompleto(sequencial.toString());
        if (!role) {
            client.sendMessage(message.from, `O rolê de ID ${sequencial} não foi encontrado`, { quotedMessageId: message.id._serialized });
            return;
        }

        if (role.participantes && role.participantes.length && role.participantes.length > 0)
            role.participantes = await Promise.all(role.participantes.map(async (x) => {
                if (x.nomeContato)
                    return x;

                const contato = (await client.getContactById(x.contactSerialized));
                x.nomeContato = perfis?.find(z => z.contactSerialized === x.contactSerialized)?.nome ?? contato.pushname ?? contato.number ?? x.contactSerialized;
                return x;
            }));

        client.sendMessage(message.from, Role.obterRoleCompleto(role), { quotedMessageId: message.id._serialized });
    }
}
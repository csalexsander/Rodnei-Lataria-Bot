import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../../interface/observers/IMessageObserver";
import RolesRepository from "../../repositorios/rolesRepository";
import Contexto from "../../database/context";
import UtilString from "../../utils/utilString";
import ComandosConstantes from "../../constantes/comandosConstantes";
import UtilMessage from "../../utils/utilMessage";
import UtilContato from "../../utils/UtilContato";

export default class RoleAnuncioObserver implements IMessageObserver{
    private repositorio: RolesRepository;

    constructor(contexto: Contexto) {
        this.repositorio = new RolesRepository(contexto);
    }
    
    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (!UtilString.compararString(comando, ComandosConstantes.anuncioRole))
            return;

        const corpo = UtilMessage.ObterCorpoMensagem(message);
        if (!corpo) {
            client.sendMessage(message.from, "É necessário informar o ID do rolê", { quotedMessageId: message.id._serialized });
            return;
        }

        console.log(corpo);
        const id = corpo.trim().split(" ")[0];
        console.log(id);

        const sequencial = parseInt(id?.trim() ?? "");
        if (!sequencial || isNaN(sequencial)) {
            client.sendMessage(message.from, "Informe o ID do rolê que deseja realizar o anuncio", { quotedMessageId: message.id._serialized });
            return;
        }

        const contato = await message.getContact();
        if (!contato || !contato.id._serialized)
            return;

        const chat = await message.getChat();
        if (!chat)
            return;

        const role = await this.repositorio.obterRoleCompleto(sequencial.toString());
        if (!role) {
            client.sendMessage(message.from, `O rolê de ID ${sequencial} não foi encontrado`, { quotedMessageId: message.id._serialized });
            return;
        }

        const ehOrganizador = role.contact_serialized == contato.id._serialized;
        const ehAdministrador = UtilContato.EhAdminGrupoDonoEvento(client, chat, message, role.contact_serialized);

        if (!ehOrganizador && !ehAdministrador) {
            client.sendMessage(message.from, `Você não tem permissão para realizar um anuncio para o rolê de ID ${sequencial}`, { quotedMessageId: message.id._serialized });
            return;
        }

        const corpoMensagemSemIdArray = corpo.trim().split(" ");
        corpoMensagemSemIdArray.shift();       
        const corpoMensagemSemId = corpoMensagemSemIdArray.join(" ");

        const cabecalho = `ATENÇÃO PARTICIPANTES DO ROLÊ ${role.sequencial} UM AVISO DO ${ehOrganizador ? "ORGANIZADOR" : (ehAdministrador ? "ADMINISTRADOR" : "MEMBRO")} ${contato.id.user}\n\n`
        const mensagemAEnviar = corpoMensagemSemId && corpoMensagemSemId.length ? corpoMensagemSemId : `Apenas relembrado que o rolê de Id ${role.sequencial} será dia ${role.data} as ${role.hora}, contamos com a sua presença`;

        const mencionados = [contato.id._serialized];
        client.sendMessage(message.from, cabecalho + mensagemAEnviar, {quotedMessageId: message.id._serialized, mentions: mencionados});
    }

}
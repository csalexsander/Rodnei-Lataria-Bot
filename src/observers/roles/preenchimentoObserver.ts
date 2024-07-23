import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../../interface/observers/IMessageObserver";
import RolesRepository from "../../repositorios/rolesRepository";
import Contexto from "../../database/context";
import ComandosConstantes from "../../constantes/comandosConstantes";
import RoleEtapaPreenchimento from "../../constantes/roleEtapaPreenchimento";
import Role from "../../entidades/role";
import UtilContato from "../../utils/UtilContato";
import moment from "moment";
import { labels } from "../../constantes/uiConstantes";

export default class PreenchimentoObserver implements IMessageObserver {
    private repositorio: RolesRepository;

    constructor(contexto: Contexto) {
        this.repositorio = new RolesRepository(contexto);
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (comando !== ComandosConstantes.mensagemRecebida)
            return;

        const contato = await message.getContact();

        if (!contato || !contato.id._serialized)
            return;

        const quotedMessage = await message.getQuotedMessage();

        if (!quotedMessage)
            return;

        //Se não estiver respondendo à uma instrução de criar/editar rolê, não checa se tem rolê à preencher.
        if (quotedMessage.body !== labels.role.nome &&
            quotedMessage.body !== labels.role.local &&
            quotedMessage.body !== labels.role.data &&
            quotedMessage.body !== labels.role.hora){
            return 
        }

        const chat = await message.getChat();

        if (!chat)
            return;

        let role: Role | null = null;

        if (UtilContato.EhAdminGrupo(client, chat, message))
            role = await this.repositorio.obterRoleAPreencherAdmin(quotedMessage.id._serialized);
        else
            role = await this.repositorio.obterRoleAPreencher(quotedMessage.id._serialized, contato.id._serialized);

        if (role == null)
            return;

        const [sucesso, valor] = this.ValidarData(role, message.body);
        if (!sucesso) {
            client.sendMessage(message.from, valor, { quotedMessageId: message.id._serialized });
            return;
        }

        if (role.etapa_preenchimento == RoleEtapaPreenchimento.edicao) {
            await this.EditarRole(client, message, role);
            return;
        }

        const proximaEtapa = role.is_edit ? RoleEtapaPreenchimento.completo : RoleEtapaPreenchimento.obterProximaEtapa(role.etapa_preenchimento);
        if (proximaEtapa !== RoleEtapaPreenchimento.completo)
            await this.PreencherCampoRole(client, message.from, message.id._serialized, role.etapa_preenchimento, role.id, message.body, proximaEtapa);
        else
            await this.CompletarRole(client, message.from, message.id._serialized, role.etapa_preenchimento, role.id, message.body, proximaEtapa, role.sequencial);
    }

    private async PreencherCampoRole(client: Client, chatId: string, messageIdQuoted: string, etapaAtual: string, id: string, valor: string, proximaEtapa: string): Promise<void> {

        const mensagemEtapa = await client.sendMessage(chatId, RoleEtapaPreenchimento.obterMensagemPreenchimento(proximaEtapa), { quotedMessageId: messageIdQuoted });

        await this.repositorio.atualizarPreencherRole(id, etapaAtual, valor, proximaEtapa, mensagemEtapa.id._serialized);
    }

    private async CompletarRole(client: Client, chatId: string, messageIdQuoted: string, etapaAtual: string, id: string, valor: string, proximaEtapa: string, sequencial: number | null): Promise<void> {

        await this.repositorio.atualizarCompletoPreencherRole(id, etapaAtual, valor, proximaEtapa, false, true, sequencial);

        const roleCompleto = await this.repositorio.obterRolePorId(id);

        console.log(roleCompleto);

        if (!roleCompleto)
            return;

        await client.sendMessage(chatId, Role.obterResumoRole(roleCompleto), { quotedMessageId: messageIdQuoted });
    }

    private async EditarRole(client: Client, message: Message, role: Role): Promise<void> {
        var opcaoSelecionada = parseInt(message.body);

        const etapaPreenchimento = RoleEtapaPreenchimento.edicaoDeRoleOpcoes[opcaoSelecionada - 1];
        if (!etapaPreenchimento) {
            await client.sendMessage(message.from, "Opção informada invalida, responda a mesma mensagem com uma opção valida", { quotedMessageId: message.id._serialized });
            return;
        }

        const mensagemEnviada = await client.sendMessage(message.from, RoleEtapaPreenchimento.obterMensagemPreenchimento(etapaPreenchimento), { quotedMessageId: message.id._serialized });

        await this.repositorio.atualizarEtapaEdicaoRole(role.id, etapaPreenchimento, mensagemEnviada.id._serialized);
    }

    private ValidarData(role: Role, valor: string): [boolean, string] {
        if (role.etapa_preenchimento != RoleEtapaPreenchimento.data)
            return [true, valor];

        console.log(valor)
        const data = moment(valor, "DD/MM/YYYY",true);
        console.log(data.isValid())

        if (!data.isValid()) {
            return [false, `A data informada "${valor}" não é uma data valida no padrão DD/MM/AAAA. ex: ${moment().format("DD/MM/YYYY")}. Responda à mesma mensagem com uma data valida`];
        }

        if (data.date < moment().date) {
            return [false, `A data informada "${valor}" não pode ser uma data no passado, responda novamente a mensagem anterior com uma data valida`];
        }

        return [true, data.format()]
    }
}
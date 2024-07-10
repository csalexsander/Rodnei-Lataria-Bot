import RoleEtapaPreenchimento from "../constantes/roleEtapaPreenchimento";
import UtilString from "../utils/utilString";
import UtilData from "../utils/utilData";
import ParticipanteRole from "./participanteRole";

export default class Role {
    id: string;
    contact_serialized: string;
    nome: string | null;
    local: string | null;
    data: string | null;
    hora: string | null;
    descricao: string | null;
    etapa_preenchimento: string;
    message_serialized: string | null;
    sequencial: number | null;
    is_edit: boolean;
    is_visible: boolean;
    participantes: ParticipanteRole[] = [];

    constructor(
        id: string,
        contact_serialized: string,
        etapa_preenchimento: string,
        message_serialized?: string,
        nome?: string,
        local?: string,
        data?: string,
        hora?: string,
        descricao?: string,
        sequencial?: number,
        is_edit: boolean = false,
        is_visible: boolean = false,
        participantes: ParticipanteRole[] = []
    ) {
        this.id = id;
        this.contact_serialized = contact_serialized;
        this.nome = nome || null;
        this.local = local || null;
        this.data = data || null;
        this.hora = hora || null;
        this.descricao = descricao || null;
        this.etapa_preenchimento = etapa_preenchimento;
        this.message_serialized = message_serialized || null;
        this.sequencial = sequencial || null;
        this.is_edit = is_edit;
        this.is_visible = is_visible;
        this.participantes = participantes;
    }

    static obterResumoRole(role: Role): string {
        return `*${UtilString.valorOuNaoInformado(role.nome)}*\n\n*Local*: ${UtilString.valorOuNaoInformado(role.local)}\n\n*Data*: ${UtilData.obterDataComSemana(UtilString.valorOuNaoInformado(role.data))} *Hora:* ${UtilString.valorOuNaoInformado(role.hora)}\n\n${UtilString.valorOuNaoInformado(role.descricao)}\n\nPara *confirmar* digite */confirmar ${role.sequencial}*\nPara *desconfirmar* basta digite */miar ${role.sequencial}*`;
    }

    static obterRoleCompleto(role: Role): string {
        const participantes = !role.participantes || !role.participantes.length || role.participantes.length <= 0 ? "\n\n\n\n" : ParticipanteRole.ObterNomesParticipantes(role.participantes);

        return `-----*ROLE*-----\n*${UtilString.valorOuNaoInformado(role.nome)}*\n\n*Local*: ${UtilString.valorOuNaoInformado(role.local)}\n\n*Data*: ${UtilData.obterDataComSemana(UtilString.valorOuNaoInformado(role.data))} *Hora:* ${UtilString.valorOuNaoInformado(role.hora)}\n\n${UtilString.valorOuNaoInformado(role.descricao)}\n\n*CONFIRMADOS (${role.participantes?.length ?? 0})*\n\n---------------------------${participantes}\n\n---------------------------\n\nPara *confirmar* digite */confirmar ${role.sequencial}*\n\nPara *desconfirmar* basta digite */miar ${role.sequencial}*`;
    }

    static obterRoleListagem(role : Role) : string  {
        return `*${role.nome}*\n*ID* ${role.sequencial}\n${role.local}\n*Data:* ${role.data} *Hora:* ${role.hora}\n\n---------------`;
    }

    static obterMensagemEdicaoRole() : string {
        const opcoes = RoleEtapaPreenchimento.edicaoDeRoleOpcoes.map((valor, index) => `*${index + 1}*	${valor}`).join("\n");

        return `Para editar o role, escolha uma das opções abaixo: \n\n${opcoes}`;
    }
}

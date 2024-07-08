import moment from "moment";
import UtilString from "../utils/utilString";
import TipoPreenchimentoPerfil from "../constantes/tipoPreenchimentoPerfil";

export default class Perfil {
    contactSerialized: string;
    contactNumber: string;
    messageSerialized: string;
    tipoPreenchimento: string;
    nome: string | null;
    relacionamento: string | null;
    flerte: string | null;
    nascimento: string | null;
    orientacao: string | null;
    roles: string | null;
    melhorlugar: string | null;
    insta: string | null;
    isEdit : boolean;

    constructor(contactSerialized: string, contactNumber: string, messageSerialized: string, tipoPreenchimento: string, nome: string | null, relacionamento: string | null, flerte: string | null, nascimento: string | null, orientacao: string | null, roles: string | null, melhorlugar: string | null, insta: string | null, isEdit : boolean = false) {
        this.contactSerialized = contactSerialized;
        this.contactNumber = contactNumber;
        this.messageSerialized = messageSerialized;
        this.tipoPreenchimento = tipoPreenchimento;
        this.nome = nome;
        this.relacionamento = relacionamento;
        this.flerte = flerte;
        this.nascimento = nascimento;
        this.orientacao = orientacao;
        this.roles = roles;
        this.melhorlugar = melhorlugar;
        this.insta = insta;
        this.isEdit = isEdit;
    }

    static obterResumoPerfil(perfil: Perfil): string {
        const dataNascimento = moment(perfil.nascimento);
        const dataNascimentoValor = dataNascimento.isValid() ? dataNascimento.format("DD/MM") : "Não Informado";
        return `*PERFIL*\n\n*Nome*:\n\n${UtilString.valorOuNaoInformado(perfil.nome)}\n\n*Relacionamento*:\n\n${UtilString.valorOuNaoInformado(perfil.relacionamento)}\n\n*PV Aberto para Flerte*:\n\n${UtilString.valorOuNaoInformado(perfil.flerte)}\n\n*Data Nascimento*:\n\n${UtilString.valorOuNaoInformado(dataNascimentoValor)}\n\n*Orientação*:\n\n${UtilString.valorOuNaoInformado(perfil.orientacao)}\n\n*Roles*:\n\n${UtilString.valorOuNaoInformado(perfil.roles)}\n\n*Melhor lugar em São Paulo*:\n\n${UtilString.valorOuNaoInformado(perfil.melhorlugar)}\n\n*Instagram*:\n\n${UtilString.valorOuNaoInformado(perfil.insta)}`;
    }

    static ObterOpcoesEdicao() : string {
        const opcoes = TipoPreenchimentoPerfil.edicaoPerfilOpcoes.map((valor, index) => `*${index + 1}*	${valor}`).join("\n");

        return `Para editar o seu perfil, escolha uma das opções abaixo: \n\n${opcoes}`;
    }
}
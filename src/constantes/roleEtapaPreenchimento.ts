import { labels } from "./uiConstantes";

export default class RoleEtapaPreenchimento {
    static nome: string = "nome";
    static local: string = "local";
    static data: string = "data";
    static hora: string = "hora";
    static descricao: string = "descricao";
    static completo: string = "completo";
    static edicao: string = "edicao";

    static edicaoDeRoleOpcoes: string[] = [this.nome, this.local, this.data, this.hora, this.descricao];

    static obterProximaEtapa(etapaAtual: string): string {
        switch (etapaAtual) {
            case this.nome:
                return this.local;

            case this.local:
                return this.data;

            case this.data:
                return this.hora;

            case this.hora:
                return this.descricao;

            case this.descricao:
            default:
                return this.completo;
        }
    }

    static obterMensagemPreenchimento(tipo: string): string {
        switch (tipo) {
            case this.nome:
            case this.local:
            case this.data:
            case this.hora:
            case this.descricao:
                return labels.role[tipo];
            default:
                throw new Error(labels.erroMetodo);
        }
    }
}
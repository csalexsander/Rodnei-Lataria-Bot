import { labels } from "./uiConstantes";

export default class TipoPreenchimentoPerfil {
    static nome: string = "nome";
    static relacionamento: string = "relacionamento";
    static flerte: string = "flerte";
    static nascimento: string = "nascimento";
    static orientacao: string = "orientacao";
    static roles: string = "roles";
    static melhorlugar: string = "melhorlugar";
    static insta: string = "insta";
    static completo: string = "completo";

    static edicaoPerfilOpcoes : string[] = [this.nome, this.relacionamento, this.flerte, this.nascimento, this.orientacao, this.roles, this.melhorlugar, this.insta];

    static obterProximaEtapa(tipoAtual: string): string {
        switch (tipoAtual) {
            case this.nome:
                return this.relacionamento;
            case this.relacionamento:
                return this.flerte;
            case this.flerte:
                return this.nascimento;
            case this.nascimento:
                return this.orientacao;
            case this.orientacao:
                return this.roles
            case this.roles:
                return this.melhorlugar;
            case this.melhorlugar:
                return this.insta;
            case this.insta:
            default:
                return this.completo;
        }
    }

    static obterMensagemPreenchimento(tipo: string): string {
        switch (tipo) {
            case this.nome:
            case this.relacionamento:
            case this.flerte:
            case this.nascimento:
            case this.orientacao:
            case this.roles:
            case this.melhorlugar:
            case this.insta:
                return labels.perfil[tipo];
            default:
                throw new Error(labels.erro.metodo);
        }
    }
}
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
                return "Informe o seu nome:";

            case this.relacionamento:
                return "Informe o seu estado de relacionamento (Solteiro/Namorando/Casado):";

            case this.flerte:
                return "PV Aberto para flerte? ";

            case this.nascimento:
                return "Informe sua data de nascimento (ex: 01/01/2021): ";

            case this.orientacao:
                return "Informe sua orientação: "

            case this.roles:
                return "Quais os seus roles favoritos? ";

            case this.melhorlugar:
                return "Para você, qual o melhor lugar de São paulo?";

            case this.insta:
                return "Informe seu instagram: "

            default:
                throw new Error("Metodo chamado indevidamente");
        }
    }
}
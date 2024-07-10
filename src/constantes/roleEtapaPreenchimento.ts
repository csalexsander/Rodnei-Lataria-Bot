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
                return "Informe o nome do role";

            case this.local:
                return "Informe o local que ocorrerá o role, para auxiliar as pessoas que vão a encontrar o local, informe tambem o endereço e demais informações referente a localização."

            case this.data:
                return "Informe a data do role no formato: DD/MM/AAAA ex 31/12/2024";

            case this.hora:
                return "Informe a hora que começará o role, ou a hora de encontro";

            case this.descricao:
                return "Informe uma descrição para que todos possam saber sobre o que se trata, forneça informações importantes sobre o lugar e/ou atividades a serem realizadas";

            default:
                throw new Error("Metodo chamado indevidamente");
        }
    }
}
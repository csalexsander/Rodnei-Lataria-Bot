export default class UtilString {
    static valorOuNaoInformado(valor: string | null): string {
        return valor ?? "Não Informado";
    }
}
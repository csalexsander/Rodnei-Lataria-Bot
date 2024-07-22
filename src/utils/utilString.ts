export default class UtilString {
    static valorOuNaoInformado(valor: string | null): string {
        return valor ?? "Não Informado";
    }

    /**
     * Compara duas strings ignorando caixa alta.
     * @param valorA Primeiro valor a ser comparado
     * @param valorB Segundo valor a ser comparado
     * @returns Returna true caso as duas strings sejam iguais independente de caixa alta ou baixa.
     */
    static compararString(valorA : string, valorB : string) : boolean {
        return valorA.toLowerCase() == valorB.toLowerCase();
    }
}
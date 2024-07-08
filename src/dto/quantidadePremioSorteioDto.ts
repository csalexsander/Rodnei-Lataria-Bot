export default class QuantidadePremioSorteioDto {
    quantidade: number;
    premio: string;

    constructor(quantidade: number = 1, premio: string = 'nada') {
        this.quantidade = quantidade;
        this.premio = premio;
    }
}
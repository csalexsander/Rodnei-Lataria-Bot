import IChaveValorDto from "../interface/dto/IChaveValorDto";

export default class ChaveValorDto implements IChaveValorDto {
    chave: string;
    valor: string;

    constructor(chave: string, valor: string) {
        this.chave = chave;
        this.valor = valor;
    }
}
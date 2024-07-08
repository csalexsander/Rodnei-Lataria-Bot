export default class UtilMatematica {
    static gerarNumeroAleatorio(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
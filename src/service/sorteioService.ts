import { Chat, GroupChat, GroupParticipant } from "whatsapp-web.js";
import UtilMatematica from "../utils/utilMatematica";
import QuantidadePremioSorteioDto from "../dto/quantidadePremioSorteioDto";

export default class SorteioService {
    sortearMembroGrupo(chat: GroupChat, quantidadeSorteado: number = 1): GroupParticipant[] | null {
        if (!chat || !chat.participants || chat.participants.length === 0)
            return null;

        const participantesSorteados: GroupParticipant[] = [];

        const numerosSorteados: number[] = [];
        for (let i = 0; i < quantidadeSorteado; i++) {
            var sorteado = this.obterNumeroSorteadoUnico(0, chat.participants.length - 1, numerosSorteados, chat.participants.length);

            if (sorteado === -1)
                return participantesSorteados;

            participantesSorteados.push(chat.participants[sorteado]);
        }

        return participantesSorteados;
    }

    public obterDadosSorteioCorpoMensagem(corpo: string | null): QuantidadePremioSorteioDto {
        if (!corpo || corpo.length === 0)
            return new QuantidadePremioSorteioDto();

        var splitado = corpo.split(" ");

        var quantidadeSorteado = parseInt(splitado[0]);

        if (isNaN(quantidadeSorteado))
            return new QuantidadePremioSorteioDto(1, corpo);

        splitado.shift();

        var premio = !splitado || splitado.length === 0 ? 'nada' : splitado.join(" ");

        return new QuantidadePremioSorteioDto(quantidadeSorteado, premio);
    }

    private obterNumeroSorteadoUnico(min: number, max: number, numerosSorteados: number[], quantidadeArray: number): number {
        let numeroUnico = false;
        let sorteado = -1;

        while (!numeroUnico) {
            sorteado = UtilMatematica.gerarNumeroAleatorio(min, max);

            if (!numerosSorteados.some(x => x === sorteado))
                numeroUnico = true;

            if (quantidadeArray > numerosSorteados.length)
                continue;

            sorteado = -1;
            numeroUnico = true;
        }

        if (sorteado === -1)
            return sorteado;

        numerosSorteados.push(sorteado);

        return sorteado;
    }
}
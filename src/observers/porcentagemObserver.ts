import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import ChaveValorDto from "../dto/chaveValorDto";
import PorcentagemService from "../service/porcentagemService";
import UtilMessage from "../utils/utilMessage";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilString from "../utils/utilString";

export default class PorcentagemObserver implements IMessageObserver {
    public readonly comandoPorcentagem = [
        new ChaveValorDto(ComandosConstantes.carente, "carente"),
        new ChaveValorDto(ComandosConstantes.chato, "chato"),
        new ChaveValorDto(ComandosConstantes.atacante, "atacante")
    ];

    public readonly servico: PorcentagemService;

    constructor() {
        this.servico = new PorcentagemService();
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        var percentDe = this.comandoPorcentagem.find(x => UtilString.compararString(x.chave, comando));

        if (!percentDe)
            return;

        var participantesId = UtilMessage.ListarParticipanteId(message);

        var mensagem = await this.servico.CalcularPorcentagemDeList(participantesId, client, percentDe.valor);

        client.sendMessage(message.from, mensagem, { mentions: participantesId })
    }
}
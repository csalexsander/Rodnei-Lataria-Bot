import { Client } from "whatsapp-web.js";
import UtilMatematica from "../utils/utilMatematica";
import ComandosConstantes from "../constantes/comandosConstantes";

export default class PorcentagemService {
    async calcularPorcentagemDe(participantId: string, client: Client, de: string): Promise<string> {
        const contato = await client.getContactById(participantId);

        const percent = UtilMatematica.gerarNumeroAleatorio(0, 100);

        return `@${contato.number} é ${percent}% ${de}`;
    }

    async CalcularPorcentagemDeList(participantsId: string[], client: Client, de: string): Promise<string> {

        const contatos = await Promise.all(participantsId.map(x => client.getContactById(x)));

        const percent = UtilMatematica.gerarNumeroAleatorio(0, 100);

        const numeros = contatos.map(x => x.number);

        let adicional = "";
        if (de === "carente" && percent > 50)
            adicional = "... Tá carente? Compra um hamert.";

        return `@${numeros.join(", @")} ${contatos.length > 1 ? "são" : "é"} ${percent}% ${de}${adicional}`;
    }
}
import { Message } from "whatsapp-web.js";
import ComandosConstantes from "../constantes/comandosConstantes";

export default class UtilMessage {
    static ObterComando(message: Message): string | null {
        const regex = /^\/([^\s]+)(?:\s+(.+))?$/;

        let invisibleCharactersRegex = /‎/g;
        const stringTratada = message.body.replace(invisibleCharactersRegex, "").toLowerCase();

        const match = regex.exec(stringTratada);

        if (!match)
            return null;

        return `/${match[1]}`;
    }

    static EhComandoValido(comando: String){
        //Se o comando for um já mapeado nas constantes, é válido
        for (const property in ComandosConstantes) {
            if (`/${property}` == comando && comando != ComandosConstantes.mensagemRecebida)
                return true;
        }

        //Qualquer coisa diferente, é inválido
        return false;
    }

    static ObterCorpoMensagem(message: Message): string | null {
        const regex = /^\/\w+\s*(.*)$/;

        const match = message.body.match(regex);

        if (!match)
            return null;

        return match[1].trim();
    }

    static ListarParticipanteId(message: Message): string[] {
        let idsMencionados: string[] = message.mentionedIds as any[];

        return (idsMencionados && idsMencionados.length ? idsMencionados : null) ?? [this.ObterParticipanteId(message)];
    }

    static ObterParticipanteId(message: Message): string {
        return message.id.participant ?? message.from;
    }
}
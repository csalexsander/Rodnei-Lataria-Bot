import { Message } from "whatsapp-web.js";

export default class UtilMessage {
    static ObterComando(message: Message): string | null {
        const regex = /^\/([^\s]+)(?:\s+(.+))?$/;

        let invisibleCharactersRegex = /‎/g;
        const stringTratada = message.body.replace(invisibleCharactersRegex, "");

        const match = regex.exec(stringTratada);

        if (!match)
            return null;

        return `/${match[1]}`;
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
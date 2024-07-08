import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilChat from "../utils/utilChat";
import UtilMessage from "../utils/utilMessage";

export default class AvisoObserver implements IMessageObserver {
    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (comando != ComandosConstantes.aviso)
            return;

        const chat = await message.getChat();

        if (!chat)
            return;

        if (!UtilChat.EhChatGrupo(chat)) {
            client.sendMessage(message.from, "Este comando apenas funciona em grupos");
            return;
        }

        const requisitante = chat.participants.find(x => x.id._serialized === message.author);
        if (!requisitante)
            return;

        if(!requisitante.isAdmin)
            return;

        let cabecalho = `Alerta do ${requisitante.isAdmin ? `Administrador` : `Membro`} @${requisitante.id.user}\n\n\n`;

        let mensagemRespondida: Message | null = null;
        if (message.hasQuotedMsg)
            mensagemRespondida = await message.getQuotedMessage();

        var participantes = chat.participants;

        const idInterno = participantes.map(x => x.id._serialized);

        let corpo = `${UtilMessage.ObterCorpoMensagem(message)}`;

        let pulaLinha = corpo && corpo.length > 0 ? `\n\n` : '';

        if (message.hasQuotedMsg && mensagemRespondida)
            corpo += `${pulaLinha}${mensagemRespondida.body}`

        if (corpo && corpo.length > 0) {
            client.sendMessage(message.from, cabecalho + corpo, { mentions: idInterno });
            return;
        }

        client.sendMessage(message.from, "Deve ser informado um aviso, ou responder uma mensagem ao qual quer avisar a todos");
    }
}
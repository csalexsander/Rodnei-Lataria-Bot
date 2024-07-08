import { Chat, Client, Message } from "whatsapp-web.js";
import UtilChat from "./utilChat";

export default class UtilContato {
    static EhAdminGrupo(client: Client, chat: Chat, message : Message) : boolean {
        if(!UtilChat.EhChatGrupo(chat))
            return false;

        if(!chat.participants || !chat.participants.length || !chat.participants.some(x => x))
            return false;

        var requisitante = chat.participants.find(x => x.id._serialized === message.id.participant ?? message.from);

        return (requisitante && requisitante.isAdmin) ?? false;
    }

    static EhAdminGrupoDonoEvento(client : Client, chat : Chat, message : Message, donoEventoSerialized : string){
        if(!UtilChat.EhChatGrupo(chat))
            return false;

        if(!chat.participants || !chat.participants.length || !chat.participants.some(x => x))
            return false;

        var donoEventoGrupo = chat.participants.find(x => x.id._serialized === donoEventoSerialized);

        if(!donoEventoGrupo)
            return false;

        var requisitante = chat.participants.find(x => x.id._serialized === message.id.participant ?? message.from);

        return (requisitante && requisitante.isAdmin) ?? false;
    }
}
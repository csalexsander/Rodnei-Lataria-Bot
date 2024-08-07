import { Chat, GroupChat } from "whatsapp-web.js";

export default class UtilChat {
    static EhChatGrupo(chat: Chat): chat is GroupChat {
        return !!chat.isGroup
    }

    static EhChatGrupoValido(chat: Chat, chatsLiberados: string[]): boolean {
        if (process.env.NODE_ENV == 'development') {
            return chat.name == 'Teste';
        }

        if (!chat)
            return false;

        if (!UtilChat.EhChatGrupo(chat))
            return true;
        
        //TODO Revisar, removido validação temporariamente.
        return UtilChat.EhChatGrupo(chat); //&& chatsLiberados.some(x => x === chat.id._serialized);
    }
}
import { Chat, GroupChat } from "whatsapp-web.js";

export default class UtilChat {
    static EhChatGrupo(chat: Chat): chat is GroupChat {
        return !!chat.isGroup
    }

    static EhChatGrupoValido(chat: Chat, chatsLiberados: string[]): boolean {
        if (!chat)
            return false;

        if (!UtilChat.EhChatGrupo(chat))
            return true;

        //TODO Revisar, removido validação temporariamente.
        if (process.env.NODE_ENV == 'development') {
            return chat.name == 'Teste';
        }
        return UtilChat.EhChatGrupo(chat) && chatsLiberados.some(x => x === chat.id._serialized);
    }
}
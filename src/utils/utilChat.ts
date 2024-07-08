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

        return UtilChat.EhChatGrupo(chat) && chatsLiberados.some(x => x === chat.id._serialized);
    }
}
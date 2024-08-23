import { Chat, GroupChat } from "whatsapp-web.js";

export default class UtilChat {
    static EhChatGrupo(chat: Chat): chat is GroupChat {
        return !!chat.isGroup
    }

    static EhChatGrupoValido(chat: Chat, chatsLiberados: string[]): boolean {
        //WIP: se em modo desenvolvimento, só vai funcionar em um grupo chamado "Teste".
        //No futuro, mapear o grupo do Boterinha, e os IDs dos contatos pra usar no PV.
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
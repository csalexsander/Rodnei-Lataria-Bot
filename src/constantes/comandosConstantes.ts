import { Events } from "whatsapp-web.js";

export default class ComandosConstantes {

    // Random
    static pong: string = "/ping";
    static sorteio: string = "/sorteio";
    static carente: string = "/carente";
    static chato: string = "/chato";
    static aviso: string = "/aviso";
    static passaro: string = "/rolas";
    static mensagemRecebida: string = "/mensagem_recebida";
    static overSharing : string = "/oversharing";
    static sortear : string = "/sortear";
    static nomeCientifico : string = "/streptopelias";
    static luva : string = "/luva";
    static jogo : string = "/jogo";
    static piada : string = "/piada";

    //Perfil    
    static perfil: string = "/perfil";
    static perfis: string = "/perfis";

    static sticker: string = "/sticker";

    //Roles
    static novoRole : string = "/novo";
    static confirmar : string = "/confirmar";
    static miar : string = "/miar";
    static roles : string = "/roles";
    static info : string = "/info";
    static removerRole : string = "/remover";
    static editarRole : string = "/editar";

    //Info
    static regras : string = "/regras";
    static ajuda : string = "/ajuda";

    // Notification
    static groupJoin: string = Events.GROUP_JOIN;
    static groupLeave: string = Events.GROUP_LEAVE;
}
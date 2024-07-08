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

    //Perfil    
    static perfil: string = "/perfil";
    static perfis: string = "/perfis";

    //Roles
    static novoRole : string = "/novo";
    static confirmar : string = "/confirmar";
    static miar : string = "/miar";
    static roles : string = "/roles";
    static info : string = "/info";
    static removerRole : string = "/remover";
    static editarRole : string = "/editar";

    // Notification
    static groupJoin: string = Events.GROUP_JOIN;
    static groupLeave: string = Events.GROUP_LEAVE;
}
import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import UtilMatematica from "../utils/utilMatematica";
import ComandosConstantes from "../constantes/comandosConstantes";
import Contexto from "../database/context";

export default class AjudaObserver implements IMessageObserver {

    constructor(contexto: Contexto) {
    }

    Executar(comando: string, message: Message, client: Client): void {
            
        const ajudaInfo : string =
        "* /ajuda \n"+
        "Mostra essa tela de ajuda.\n"+
        "\n"+
        "* /regras\n"+
        "Exibe as regras do grupo.\n"+
        "\n"+
        "* /confirmar ID\n"+
        "Confirma sua presença em um evento.\n"+
        "\n"+
        "* /info ID\n"+
        "Mostra informações sobre um evento.\n"+
        "\n"+
        "* /miar ID\n"+
        "Cancela sua presença em um evento.\n"+
        "\n"+
        "* /roles \n"+
        "Agenda de eventos.";

        if(comando != ComandosConstantes.ajuda)
            return;
       
       client.sendMessage(message.from, ajudaInfo);
    }

}


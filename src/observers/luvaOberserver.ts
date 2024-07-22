import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import UtilMatematica from "../utils/utilMatematica";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilString from "../utils/utilString";

export default class LuvaObserver implements IMessageObserver {
    private readonly frases: string[] = ["receba", "pereça", "prevaleça", "padeça", "cresça", "apodreça", "emburreça", "compareça", "endureça", "esqueça", "faleça", "mereça"];
    
    Executar(comando: string, message: Message, client: Client): void {
        if (!UtilString.compararString(comando, ComandosConstantes.luva))
            return;
       
        var numero = UtilMatematica.gerarNumeroAleatorio(0,this.frases.length -1);

        var mensagem = this.frases[numero];

       client.sendMessage(message.from, mensagem ?? "Receba", {quotedMessageId : message.id._serialized});
    }

}
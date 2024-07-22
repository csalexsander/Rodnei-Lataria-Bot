import { Message, Client } from 'whatsapp-web.js';
import IMessageObserver from '../interface/observers/IMessageObserver';
import ComandosConstantes from '../constantes/comandosConstantes';
import UtilString from '../utils/utilString';

export default class PongObserver implements IMessageObserver {
    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (!UtilString.compararString(comando, ComandosConstantes.pong))
            return;        

        client.sendMessage(message.from, "pong");
    };

}
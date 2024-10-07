import { Message, Client } from 'whatsapp-web.js';
import IMessageObserver from '../interface/observers/IMessageObserver';
import ComandosConstantes from '../constantes/comandosConstantes';
import UtilString from '../utils/utilString';
import GoogleAnalyticsRepository from '../repositorios/googleAnalyticsRepository';

export default class PongObserver implements IMessageObserver {
    private gaRepository: GoogleAnalyticsRepository;

    constructor(){
        this.gaRepository = new GoogleAnalyticsRepository();
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (!UtilString.compararString(comando, ComandosConstantes.pong))
            return;        

        client.sendMessage(message.from, "pong");

        this.gaRepository.sendEvent();
    };

}
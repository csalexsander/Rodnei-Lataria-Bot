import { GroupNotification, Client, MessageMedia, MessageTypes } from "whatsapp-web.js";
import INotificationObserver from "../interface/observers/INotificationOberver";
import ComandosConstantes from "../constantes/comandosConstantes";

export default class EntradaObserver implements INotificationObserver {
    async Executar(comando: string, notification: GroupNotification, client: Client): Promise<void> {
        if (comando != ComandosConstantes.groupJoin)
            return;

        var contato = await client.getContactById(notification.id.participant);

        client.sendMessage(notification.chatId, `Bem Vinde @${contato.number}\n\n*Primeiramente, apresente-se para que possamos ~julgar~ conhecer sua pessoa:\n\nNome\nIdade\nEstado Civil\nRolê(s) ideal(ais)\nZona/bairro que moras\nOpinião sobre o Elon Musk\nFrase pra sua lápide\nHobby(ies)\nFoto e/ou instagram`, { mentions: [contato.id._serialized] });
        client.sendMessage(notification.chatId, MessageMedia.fromFilePath(`src/assets/audio/bemvinde.mp3`), { mentions: [contato.id._serialized] });
    }

}
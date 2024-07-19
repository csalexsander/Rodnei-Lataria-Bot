import { GroupNotification, Client, GroupNotificationTypes } from "whatsapp-web.js";
import INotificationObserver from "../interface/observers/INotificationOberver";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilString from "../utils/utilString";

export default class SaidaObserver implements INotificationObserver {
    async Executar(comando: string, notification: GroupNotification, client: Client): Promise<void> {
        if (!UtilString.compararString(comando, ComandosConstantes.groupLeave))
            return;

        var contato = await client.getContactById(notification.id.participant);

        let mensagem = "";
        if (notification.type === GroupNotificationTypes.REMOVE)
            mensagem = `Ja foi tarde! @${contato.number} foi *BAN* te conhecer`;
        else
            mensagem = `Adeus @${contato.number} você vai fazer falta`;

        client.sendMessage(notification.chatId, mensagem, { mentions: [contato.id._serialized] });
    }

}
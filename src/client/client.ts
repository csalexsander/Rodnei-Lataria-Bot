import qrcode from 'qrcode-terminal';
import { Client, Events, LocalAuth } from 'whatsapp-web.js';
import MessageSubscriber from '../subscriber/messageSubscriber';
import NotificationSubscriber from '../subscriber/notificationSubscriber';
import ComandosConstantes from '../constantes/comandosConstantes';
import Contexto from '../database/context';
import UtilChat from '../utils/utilChat';

const wwebVersion = '2.2407.3';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true , args: [
            '--no-sandbox', '--disable-setuid-sandbox'
        ],
      },
      webVersionCache: {
          type: 'remote',
          remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
      },
});

const chatsGrupoAutorizados = [
    "120363292454808888@g.us",
    "120363029696309183@g.us",//OtakuGamerinha ðŸ¤“
    "120363042128364074@g.us",//JudiciÃ¡rio Galerinha
    "120363147293284391@g.us",//Leiturinha ðŸ“–
    "120363162044765419@g.us",//Marombeirinha
    "120363162635050806@g.us",//Musicalerinha ðŸ”ŠðŸŽ¹ðŸ¥
    "120363218228606829@g.us",//Audiovisualerinha
    "120363291205486002@g.us",//Boterinha
    "120363307488072736@g.us",//Pinturinha
];

let messageSubscriber: MessageSubscriber;
let notificationSubscriber: NotificationSubscriber;
let contexto: Contexto;

client.on(Events.READY, () => {
    console.log('Client is ready!');
    
    contexto.inicializarBanco();
});

client.on(Events.QR_RECEIVED, qr => {
    qrcode.generate(qr, { small: true });
});

client.on(Events.MESSAGE_RECEIVED, async message => {
    try {
        const chat = await message.getChat()

        if(!UtilChat.EhChatGrupoValido(chat, chatsGrupoAutorizados))
            return;

        messageSubscriber.NotificarMessageObservers(message, client);
    } catch (error) {
        console.error(error);
    }
});

client.on(Events.GROUP_JOIN, async notification => {
    try {
        const chat = await notification.getChat()

        if(!UtilChat.EhChatGrupoValido(chat, chatsGrupoAutorizados))
            return;

        notificationSubscriber.NotificarNotificationObservers(ComandosConstantes.groupJoin, notification, client);
    } catch (error) {
        console.error(error);
    }
});

client.on(Events.GROUP_LEAVE, async notification => {
    try {
        const chat = await notification.getChat()

        if(!UtilChat.EhChatGrupoValido(chat, chatsGrupoAutorizados))
            return;

        notificationSubscriber.NotificarNotificationObservers(ComandosConstantes.groupLeave, notification, client);
    } catch (error) {
        console.error(error);
    }
});

const cadastrarSubscriber = (mesSubscriber: MessageSubscriber, notSubscriber: NotificationSubscriber) => {
    messageSubscriber = mesSubscriber;
    notificationSubscriber = notSubscriber;
}

const cadastrarContexto = (ctx: Contexto) => {
    contexto = ctx;
}

export { client, cadastrarSubscriber, cadastrarContexto };
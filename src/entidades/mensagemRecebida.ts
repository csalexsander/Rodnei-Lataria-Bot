export default class MensagemRecebida {
    messageSerialized: string;
    contactNumber: string;
    contactSerialized: string;
    chatSerialized: string;
    messageDateTime: string;

    constructor(
        messageSerialized: string,
        contactNumber: string,
        contactSerialized: string,
        chatSerialized: string,
        messageDateTime: string
    ) {
        this.messageSerialized = messageSerialized;
        this.contactNumber = contactNumber;
        this.contactSerialized = contactSerialized;
        this.chatSerialized = chatSerialized;
        this.messageDateTime = messageDateTime;
    }
}
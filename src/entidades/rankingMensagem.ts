export default class RankingMensagem {
    contactNumber: string;
    totalMessages: string;
    contactSerialized: string;

    constructor(
        contactSerialized: string,
        contactNumber: string,
        totalMessages: string
    ) {
        this.contactNumber = contactNumber;
        this.contactSerialized = contactSerialized;
        this.totalMessages = totalMessages;
    }
}
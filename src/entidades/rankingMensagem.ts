export default class RankingMensagem {
    contactNumber: string;
    totalMessages: string;

    constructor(
        contactNumber: string,
        totalMessages: string
    ) {
        this.contactNumber = contactNumber;
        this.totalMessages = totalMessages;
    }
}
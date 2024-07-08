export default class ParticipanteRole {
    eventId: string;
    contactSerialized: string;
    nomeContato: string | null = null;

    constructor(eventId: string, contactSerialized: string, nomeContato: string | null = null) {
        this.eventId = eventId;
        this.contactSerialized = contactSerialized;
        this.nomeContato = nomeContato;
    }

    static ObterNomesParticipantes(participantes: ParticipanteRole[]): string {
        return `\n\n    - ${participantes.sort((a, b) => a.nomeContato?.localeCompare(b.nomeContato ?? "") ?? 0).map(x => x.nomeContato ?? x.contactSerialized).join("\n    - ")}`;
    }
}
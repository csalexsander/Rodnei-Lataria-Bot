import Contexto from "../database/context";
import MensagemRecebida from "../entidades/mensagemRecebida";

export default class MensagemRecebidaRepository {
    private contexto: Contexto;

    constructor(contexto: Contexto) {
        this.contexto = contexto;
    }

    async inserirMensagemRecebida(mensagem: MensagemRecebida): Promise<void> {
        try {
            const sql = ` INSERT INTO messages (message_serialized, contact_number, contact_serialized, chat_serialized, message_date_time)
                          VALUES (:messageSerialized, :contactNumber, :contactSerialized, :chatSerialized, :messageDateTime)`;

            const params = {
                ':messageSerialized': mensagem.messageSerialized,
                ':contactNumber': mensagem.contactNumber,
                ':contactSerialized': mensagem.contactSerialized,
                ':chatSerialized': mensagem.chatSerialized,
                ':messageDateTime': mensagem.messageDateTime,
            };

            await this.contexto.inserir(sql, params);
        } catch (error) {
            console.log("Ocorreu um erro ao inserir mensagem recebida", error);
            throw error;
        }
    }
}
import moment from "moment";
import Contexto from "../database/context";
import MensagemRecebida from "../entidades/mensagemRecebida";
import RankingMensagem from "../entidades/rankingMensagem";

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

    async obterRankingMensagens(chatSerialized: string, inicio : string, fim : string): Promise<RankingMensagem[] | null> {
        try {
            const sql = `SELECT contact_serialized as contactSerialized, contact_number as contactNumber, count(*) as totalMessages
                         FROM messages where chat_serialized = ? and message_date_time >= ? 
                         and message_date_time <= ? group by chat_serialized, contact_serialized, contact_number 
                         order by count(*) desc;`

            return await this.contexto.listar(sql, [chatSerialized, inicio, fim]);
        } catch (error) {
            console.error("Ocorreu uma falha ao obter o ranking de mensagens");
            return null;
        }
    }
}
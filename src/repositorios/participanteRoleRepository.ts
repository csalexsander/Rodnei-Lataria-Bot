import Contexto from "../database/context";
import ParticipanteRole from "../entidades/participanteRole";

export default class ParticipanteRoleRepository {
    private contexto: Contexto;

    constructor(contexto: Contexto) {
        this.contexto = contexto;
    }

    async criarParticipanteRole(eventId: string, contactSerialized: string): Promise<void> {
        try {
            const sql = `INSERT INTO roles_participantes (
                eventId,
                contactSerialized
            )
            VALUES (
                ?,
                ?
            );`;

            const params = [eventId, contactSerialized];

            await this.contexto.inserir(sql, params);
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar cadastar a participação no evento");
        }
    }

    async deletarParticipanteRole(eventId: string, contactSerialized: string): Promise<void> {
        try {
            const sql = `DELETE FROM roles_participantes
                         WHERE eventId = ? AND contactSerialized = ?;`;

            const params = [eventId, contactSerialized];

            await this.contexto.deletar(sql, params);
        } catch (error) {
            console.error("Ocorreu uma falha ao deletar o participante do role");
        }
    }

    async obterParticipanteRole(eventId: string, contactSerialized: string): Promise<ParticipanteRole | null> {
        try {
            const sql = `SELECT eventId,
                                contactSerialized
                        FROM roles_participantes 
                        WHERE eventId = ? and contactSerialized = ?;`;

            const params = [eventId, contactSerialized];

            return await this.contexto.obter<ParticipanteRole>(sql, params);
        } catch (error) {
            console.error("Ocorreu uma falha ao obter o participante do Role");
            return null;
        }
    }
}
import Contexto from "../database/context";
import PerfilView from "../entidades/perfilView";

export default class PerfilViewRepository {
    private contexto: Contexto;

    constructor(contexto: Contexto) {
        this.contexto = contexto;
    }

    async upInsert(contactSerialized: string, messageSerialized: string): Promise<void> {
        try {
            const sql = `INSERT OR REPLACE INTO profile_view (contact_serialized, message_serializes) 
                     VALUES (:contactSerialized, :messageSerialized);`

            const params = {
                ":contactSerialized": contactSerialized,
                ":messageSerialized": messageSerialized
            };

            this.contexto.atualizar(sql, params);
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar dar UpInsert no ProfileView");
        }
    }    

    async obterPerfilView(contactId: string): Promise<PerfilView | null> {
        try {
            const sql = `SELECT contact_serialized as contactSerialized,
                            message_serializes as messageSerializes
                        FROM profile_view where contact_serialized = :contactSerialized;`;

            const parametros = {
                ":contactSerialized": contactId
            };

            return this.contexto.obter<PerfilView>(sql, parametros);
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar obter o perfil view do contato");
            return null;
        }
    }
}
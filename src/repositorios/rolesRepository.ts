import moment from "moment";
import Contexto from "../database/context";
import ParticipanteRole from "../entidades/participanteRole";
import Role from "../entidades/role";

export default class RolesRepository {
    private contexto: Contexto;

    constructor(contexto: Contexto) {
        this.contexto = contexto;
    }

    async criarRole(role: Role): Promise<void> {
        try {
            const sql = `
            INSERT OR REPLACE INTO roles (
            id,contact_serialized, nome, local, data, hora, descricao, 
            etapa_preenchimento, message_serialized, sequencial, is_edit, is_visible) 
            VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

            const params = [
                role.id,
                role.contact_serialized,
                role.nome,
                role.local,
                role.data,
                role.hora,
                role.descricao,
                role.etapa_preenchimento,
                role.message_serialized,
                role.sequencial,
                role.is_edit ? 1 : 0,
                role.is_visible ? 1 : 0,
            ];
            return this.contexto.inserir(sql, params);
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar criar o role");
            throw error;
        }
    }

    async obterRoleAPreencher(message_serialized: string, contact_serialized: string): Promise<Role | null> {
        try {
            const sql = `SELECT * FROM roles where contact_serialized = ? and message_serialized = ? and is_visible = true;`;

            const params = [contact_serialized, message_serialized];

            return await this.contexto.obter<Role>(sql, params);
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar obter o role em preenchimento");
            return null;
        }
    }

    async obterRoleAPreencherAdmin(message_serialized: string): Promise<Role | null> {
        try {
            const sql = `SELECT * FROM roles where message_serialized = ? and is_visible = true;`;

            const params = [message_serialized];

            return await this.contexto.obter<Role>(sql, params);
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar obter o role em preenchimento");
            return null;
        }
    }

    async obterRolePorId(id: string): Promise<Role | null> {
        try {
            const sql = `SELECT * FROM roles where id = ? and is_visible = true;`;

            const params = [id];

            return await this.contexto.obter<Role>(sql, params);
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar obter o role por id");
            return null;
        }
    }

    async obterRolePorSequencial(sequencial: string): Promise<Role | null> {
        try {
            const data = moment().format("YYYY-MM-DD");

            const sql = `SELECT * FROM roles where sequencial = ? and date(substr(data, 7, 4) || '-' || substr(data, 4, 2) || '-' || substr(data, 1, 2)) >= ? and is_visible = true;`;

            const params = [sequencial, data];

            return await this.contexto.obter<Role>(sql, params);
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar obter o role por id");
            return null;
        }
    }

    async atualizarPreencherRole(id: string, nomeCampo: string, valor: string, etapaPreenchimento: string, messageSerialized: string): Promise<void> {
        try {
            const sql = `UPDATE roles
                            SET ${nomeCampo} = ?,
                               etapa_preenchimento = ?,
                               message_serialized = ?
                            WHERE id = ?;`;

            const params = [valor, etapaPreenchimento, messageSerialized, id];

            await this.contexto.atualizar(sql, params);
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar atualizar o role em preenchimento");
        }
    }

    async atualizarEtapaEdicaoRole(id: string, etapaPreenchimento: string, messageSerialized: string): Promise<void> {
        try {
            const sql = `UPDATE roles
                            SET is_edit = true,
                               etapa_preenchimento = ?,
                               message_serialized = ?
                            WHERE id = ?;`;

            const params = [etapaPreenchimento, messageSerialized, id];

            await this.contexto.atualizar(sql, params);
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar atualizar o role em edicao");
        }
    }

    async atualizarCompletoPreencherRole(id: string, nomeCampo: string, valor: string, etapaPreenchimento: string, isEdit: boolean, isVisible: boolean, sequencial : number | null = null): Promise<void> {
        try {
            const sql = `UPDATE roles
                        SET 
                           ${nomeCampo} = ?,
                           etapa_preenchimento = ?,
                           message_serialized = NULL,
                           sequencial = ${sequencial ?? "coalesce((select sequencial from roles order by sequencial desc limit 1) + 1, 1)"},
                           is_edit = ?,
                           is_visible = ?
                        WHERE id = ?;`;

            const params = [valor, etapaPreenchimento, isEdit, isVisible, id];

            this.contexto.atualizar(sql, params);
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar completar role");
        }
    }

    async listarRolesAtivos(): Promise<Role[] | null> {
        try {
            const dataAtual = moment().format("YYYY-MM-DD");

            const sql = `SELECT * FROM roles where is_visible = true and date(substr(data, 7, 4) || '-' || substr(data, 4, 2) || '-' || substr(data, 1, 2)) >= ? ORDER BY date(substr(data, 7, 4) || '-' || substr(data, 4, 2) || '-' || substr(data, 1, 2)) ASC ;`;

            const retorno = await this.contexto.listar(sql, [dataAtual]);

            return retorno as Role[];
        } catch (error) {
            console.log("Ocorreu uma falha ao tentar listar os roles ativos");
            return null;
        }
    }

    async obterRoleCompleto(sequencial: string): Promise<Role | null> {
        try {
            const data = moment().format("YYYY-MM-DD");

            const sql = `
                            SELECT 
                              r.id,
                              r.contact_serialized,
                              r.nome,
                              r.local,
                              r.data,
                              r.hora,
                              r.descricao,
                              r.etapa_preenchimento,
                              r.message_serialized,
                              r.sequencial,
                              r.is_edit,
                              r.is_visible,
                              rp.eventId,
                              rp.contactSerialized
                            FROM 
                              roles r
                            LEFT JOIN 
                              roles_participantes rp
                            ON 
                              r.id = rp.eventId
                            WHERE
                              r.sequencial = ? and is_visible = true and date(substr(data, 7, 4) || '-' || substr(data, 4, 2) || '-' || substr(data, 1, 2)) >= ?;`;

            const params = [sequencial, data];

            const retorno = await this.contexto.listar(sql, params);

            if (!retorno)
                return null;

            const rolesMap: { [key: string]: Role } = {};

            retorno.forEach(linha => {
                if (!rolesMap[linha.id])
                    rolesMap[linha.id] = new Role(linha.id, linha.contact_serialized, linha.etapa_preenchimento, linha.message_serialized, linha.nome, linha.local, linha.data, linha.hora, linha.descricao, linha.sequencial, linha.is_edit, linha.is_visible);

                if (linha.eventId) {
                    rolesMap[linha.id].participantes.push(new ParticipanteRole(linha.eventId, linha.contactSerialized, linha.nomeContato));
                }
            });

            return Object.values(rolesMap)[0];
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar obter o role completo");
            return null;
        }
    }

    async esconderRole(roleIdSerialized : string) : Promise<void> {
        try {
            const message = `UPDATE roles
                                SET is_visible = false
                                WHERE id = ?;`;

            const params = [roleIdSerialized];
            
            await this.contexto.atualizar(message, params);
        } catch (error) {
            console.error("Ocorreu uma falha ao esconder o role");            
        }
    }
}
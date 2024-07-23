import Contexto from "../database/context";
import Perfil from "../entidades/perfil";

export default class PerfilRepository {
    private contexto: Contexto;

    constructor(contexto: Contexto) {
        this.contexto = contexto;
    }

    async obterPerfilContato(contactId: string): Promise<Perfil | null> {
        try {
            const sql = `SELECT contact_serialized as contactSerialized,
                    contact_number as contactNumber,
                    nome,
                    relacionamento,
                    flerte,
                    nascimento,
                    orientacao,
                    roles,
                    melhorlugar,
                    insta,
                    message_serialized as messageSerialized,
                    tipo_preenchimento as tipoPreenchimento,
                    is_edit as isEdit
                    FROM profiles where contact_serialized = :contactSerialized;`;

            const parametros = {
                ":contactSerialized": contactId
            };

            return this.contexto.obter<Perfil>(sql, parametros);
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar obter o perfil");
            throw error;
        }
    }

    async listarTodosPerfilContato(): Promise<Perfil[] | null> {
        try {
            const sql = `SELECT contact_serialized as contactSerialized,
                    contact_number as contactNumber,
                    nome,
                    relacionamento,
                    flerte,
                    nascimento,
                    orientacao,
                    roles,
                    melhorlugar,
                    insta,
                    message_serialized as messageSerialized,
                    tipo_preenchimento as tipoPreenchimento,
                    is_edit as isEdit
                    FROM profiles order by COALESCE(lower(nome),contact_number) asc`;

            const result = await this.contexto.listar(sql);

            if(!result)
                return result;

            return result as Perfil[];
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar obter o perfil");
            throw error;
        }
    }

    async obterTodosNomesPerfis(): Promise<string[] | null> {
        try {
            const sql = `SELECT COALESCE(nome,contact_number) as retorno FROM profiles order by COALESCE(lower(nome),contact_number) asc`;

            const retorno = await this.contexto.listar(sql);

            if(!retorno || !retorno.length || retorno.length <= 0)
                return null;

            return retorno.map(x => x.retorno) as string[];
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar todos os nomes de perfil");
            throw error;
        }
    }

    async obterPerfilContatoMensagem(contactId: string, messageSerialized: string): Promise<Perfil | null> {
        try {
            const sql = `SELECT contact_serialized as contactSerialized,
                    contact_number as contactNumber,
                    nome,
                    relacionamento,
                    flerte,
                    nascimento,
                    orientacao,
                    roles,
                    melhorlugar,
                    insta,
                    message_serialized as messageSerialized,
                    tipo_preenchimento as tipoPreenchimento,                    
                    is_edit as isEdit
                    FROM profiles where contact_serialized = :contactSerialized and message_serialized = :messageSerialized;`;

            const parametros = {
                ":contactSerialized": contactId,
                ":messageSerialized": messageSerialized
            };

            return this.contexto.obter<Perfil>(sql, parametros);
        } catch (error) {
            console.error("Ocorreu uma falha ao tentar obter o perfil");
            throw error;
        }
    }

    async salvarPerfilContato(perfil: Perfil): Promise<void> {
        try {
            const sql = `INSERT INTO profiles (
                contact_serialized,
                contact_number,
                nome,
                relacionamento,
                flerte,
                nascimento,
                orientacao,
                roles,
                melhorlugar,
                insta,
                message_serialized,
                tipo_preenchimento
            )
            VALUES (
                :contact_serialized,
                :contact_number,
                :nome,
                :relacionamento,
                :flerte,
                :nascimento,
                :orientacao,
                :roles,
                :melhorlugar,
                :insta,
                :message_serialized,
                :tipo_preenchimento
            );`;

            const params = {
                ':contact_serialized': perfil.contactSerialized,
                ':contact_number': perfil.contactNumber,
                ':nome': perfil.nome,
                ':relacionamento': perfil.relacionamento,
                ':flerte': perfil.flerte,
                ':nascimento': perfil.nascimento,
                ':orientacao': perfil.orientacao,
                ':roles': perfil.roles,
                ':melhorlugar': perfil.melhorlugar,
                ':insta': perfil.insta,
                ':message_serialized': perfil.messageSerialized,
                ':tipo_preenchimento': perfil.tipoPreenchimento,
            };

            await this.contexto.inserir(sql, params);

        } catch (error) {
            console.error("Falha ao inserir perfil");
            throw error;
        }
    }

    async atualizarMessageSerializedTipoPreenchimento(messageSerialized: string, contactSerialized: string, tipoPreenchimento: string): Promise<void> {
        try {
            const sql = `UPDATE profiles SET
                         message_serialized = :messageSerialized,
                         tipo_preenchimento = :tipoPreenchimento
                     WHERE contact_serialized = :contactSerialized`;

            const params = {
                ':messageSerialized': messageSerialized,
                ':contactSerialized': contactSerialized,
                ':tipoPreenchimento': tipoPreenchimento,
            };

            await this.contexto.atualizar(sql, params);
        } catch (error) {
            console.error("Falha ao atualizar campos do contato");
            throw error;
        }
    }

    async atualizarEtapaEdicao(messageSerialized: string | null, contactSerialized: string, tipoPreenchimento: string, ehEdicao: boolean, tipoPreenchimentoAtual: string): Promise<void> {
        try {
            const sql = `UPDATE profiles SET
                         message_serialized = :messageSerialized,
                         tipo_preenchimento = :tipoPreenchimento,
                         is_edit = :isEdit
                     WHERE contact_serialized = :contactSerialized AND
                         tipo_preenchimento = :tipoPreenchimentoAtual`;

            const params = {
                ':messageSerialized': messageSerialized,
                ':contactSerialized': contactSerialized,
                ':tipoPreenchimento': tipoPreenchimento,
                ":isEdit": ehEdicao,
                ":tipoPreenchimentoAtual": tipoPreenchimentoAtual
            };

            await this.contexto.atualizar(sql, params);
        } catch (error) {
            console.error("Falha ao atualizar campos do contato");
            throw error;
        }
    }

    async atualizarParteContato(messageSerialized: string | null, contactSerialized: string, tipoPreenchimento: string, tipoValor: string, valor: string): Promise<void> {
        try {
            const sql = `UPDATE profiles
                     SET ${tipoValor} = :valor,
                         message_serialized = :messageSerialized,
                         tipo_preenchimento = :tipoPreenchimento,
                         is_edit = :isEdit
                     WHERE contact_serialized = :contactSerialized AND
                         tipo_preenchimento = :tipoValor`;

            const params = {
                ':valor': valor,
                ':tipoValor': tipoValor,
                ':messageSerialized': messageSerialized,
                ':contactSerialized': contactSerialized,
                ':tipoPreenchimento': tipoPreenchimento,
                ':isEdit': false
            };

            await this.contexto.atualizar(sql, params);
        } catch (error) {
            console.error("Falha ao atualizar campos do contato");
            throw error;
        }
    }
}
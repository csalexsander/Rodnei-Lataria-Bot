const sqlite3 = require('sqlite3').verbose();

import { open, Database } from 'sqlite';
import TabelasConstantes from '../constantes/tabelasConstantes';

export default class Contexto {
    private db: Database;

    private async abrirConexao(): Promise<void> {
        try {
            this.db = await open({
                filename: './database/mydatabase.db', // Specify the database file
                driver: sqlite3.Database,
            });

            if (process.env.NODE_ENV == 'development') {            
                this.db.on('trace', function (sql : string) {
                    console.log(sql);
                });
            }

            console.log("conexão aberta");
        } catch (error: unknown) {
            console.error("falha ao abrir conexão", error);
        }
    }

    async inicializarBanco(): Promise<void> {
        try {
            if (!this.db)
                await this.abrirConexao();

            await this.criarTabelasSeNaoExistir(TabelasConstantes.mensagens, () => this.criarMessageReceived());
            await this.criarTabelasSeNaoExistir(TabelasConstantes.perfis, () => this.criarProfile());
            await this.criarTabelasSeNaoExistir(TabelasConstantes.perfisView, () => this.CriarProfileView());
            await this.criarTabelasSeNaoExistir(TabelasConstantes.roles, () => this.CriarRoles());
            await this.criarTabelasSeNaoExistir(TabelasConstantes.participanteRoles, () => this.CriarParticipanteRole());

        } catch (error) {
            console.error("Ocorreu uma falha ao inicializar o banco de dados", error);
        }
    }

    private async criarTabelasSeNaoExistir(nomeTabela: string, funcaoCriacao: Function): Promise<void> {
        var tabelaExiste = await this.tabelaExiste(nomeTabela);
        if (!tabelaExiste)
            await funcaoCriacao();
    }

    private async tabelaExiste(nomeTabela: string): Promise<boolean> {
        const result = await this.db.get(`PRAGMA table_info(${nomeTabela});`);

        return !!result;
    }

    private async criarMessageReceived(): Promise<void> {
        await this.db.exec(`
                CREATE TABLE IF NOT EXISTS ${TabelasConstantes.mensagens} (
                    message_serialized TEXT PRIMARY KEY,
                    contact_number TEXT NOT NULL,
                    contact_serialized TEXT NOT NULL,
                    chat_serialized TEXT NOT NULL,
                    message_date_time TEXT NOT NULL
                );`);

        console.log("Tabela messages criada")
    }

    private async criarProfile(): Promise<void> {
        await this.db.exec(`CREATE TABLE IF NOT EXISTS ${TabelasConstantes.perfis} (
            contact_serialized TEXT PRIMARY KEY NOT NULL,
            contact_number TEXT NOT NULL,
            nome TEXT ,
            relacionamento TEXT,
            flerte TEXT,
            nascimento TEXT,
            orientacao TEXT,
            roles TEXT,
            melhorlugar TEXT,
            insta TEXT,
            message_serialized TEXT,
            tipo_preenchimento TEXT NOT NULL,
            is_edit BOOLEAN DEFAULT 0
        );`);

        console.log("Tabela profiles criada");
    }

    private async CriarProfileView(): Promise<void> {
        await this.db.exec(` CREATE TABLE IF NOT EXISTS ${TabelasConstantes.perfisView} (
            contact_serialized TEXT NOT NULL PRIMARY KEY,
            message_serializes TEXT NOT NULL
        );`);

        console.log("Tabela perfil view criada");
    }

    private async CriarRoles(): Promise<void> {
        await this.db.exec(`CREATE TABLE IF NOT EXISTS ${TabelasConstantes.roles} (
                                id TEXT PRIMARY KEY UNIQUE,
                                contact_serialized TEXT NOT NULL,
                                nome TEXT,
                                local TEXT,
                                data TEXT,
                                hora TEXT,
                                descricao TEXT,
                                etapa_preenchimento TEXT NOT NULL,
                                message_serialized TEXT,
                                sequencial INTEGER,
                                is_edit BOOLEAN DEFAULT 0,
                                is_visible BOOLEAN DEFAULT 0
                            );`);

        console.log("Tabela roles criada");
    }

    private async CriarParticipanteRole(): Promise<void> {
        await this.db.exec(`CREATE TABLE ${TabelasConstantes.participanteRoles} (
                                eventId TEXT,
                                contactSerialized TEXT,
                                PRIMARY KEY (eventId, contactSerialized));`);

        console.log("Tabela participante roles criada");
    }

    async inserir(sql: string, parametros: any | null): Promise<void> {
        try {
            if (!this.db)
                await this.inicializarBanco();

            // Executa o script SQL com os parâmetros fornecidos
            await this.db.run(sql, parametros);

            console.log("Dados inseridos com sucesso.");
        } catch (error: unknown) {
            console.error("Falha ao inserir dados", error);
            throw error;
        }
    }

    async deletar(sql: string, parametros: any | null): Promise<void> {
        try {
            if (!this.db)
                await this.inicializarBanco();

            // Executa o script SQL com os parâmetros fornecidos
            await this.db.run(sql, parametros);

            console.log("Dados deletados com sucesso.");
        } catch (error: unknown) {
            console.error("Falha ao deletar dados", error);
            throw error;
        }
    }

    async atualizar(sql: string, parametros: any | null): Promise<void> {
        try {
            if (!this.db)
                await this.inicializarBanco();

            // Executa o script SQL com os parâmetros fornecidos
            await this.db.run(sql, parametros);

            console.log("Dados atualizados com sucesso.");
        } catch (error: unknown) {
            console.error("Falha ao atualizar dados", error);
            throw error;
        }
    }

    async obter<T>(sql: string, parametros: any | null = null): Promise<T | null> {
        try {
            if (!this.db)
                await this.inicializarBanco();

            const result = await this.db.get(sql, parametros);

            console.log(`Dados obtidos com sucesso`);
            
            return result as T;
        } catch (error) {
            console.error("Falha ao tentar obter dados");
            throw error;
        }
    }

    async listar(sql: string, parametros: any | null = null): Promise<any[] | null> {
        try {
            if (!this.db)
                await this.inicializarBanco();

            let result = null;

            if (parametros)
                result = await this.db.all(sql, parametros);
            else
                result = await this.db.all(sql);

            console.log(`Dados obtidos com sucesso`);

            return result;
        } catch (error) {
            console.error("Falha ao tentar obter dados");
            throw error;
        }
    }
}
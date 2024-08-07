import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../../interface/observers/IMessageObserver";
import ComandosConstantes from "../../constantes/comandosConstantes";
import RolesRepository from "../../repositorios/rolesRepository";
import Contexto from "../../database/context";
import Role from "../../entidades/role";

export default class RolesObserver implements IMessageObserver {
    private repositorio: RolesRepository;

    constructor(contexto: Contexto) {
        this.repositorio = new RolesRepository(contexto);
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (comando != ComandosConstantes.roles)
            return;

        console.log(`[/roles] ${new Date().toISOString()} Consultando lista de rolês`)
        
        const roles = await this.repositorio.listarRolesAtivos();

        console.log(`[/roles] ${new Date().toISOString()} Lista de rolês retornadas`)

        if (!roles)
            return;

        const resumo = roles.map(x => Role.obterRoleListagem(x)).join("\n\n");

        const mensagem = `*AGENDA*\n------------------------------\n\n${resumo}\n\nPara *Confirmar* a presença, digite */confirmar ID*\nPara *Detalhe* do rolê, digite */info ID*\nPara *Desconfirmar* a presença, digite */miar ID*`;

        console.log(`[/roles] ${new Date().toISOString()} Enviando lista de rolês`)

        await client.sendMessage(message.from, mensagem);

        console.log(`[/roles] ${new Date().toISOString()} Lista enviada`)
    }
}
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

        const roles = await this.repositorio.listarRolesAtivos();

        if (!roles)
            return;

        const resumo = roles.map(x => Role.obterRoleListagem(x)).join("\n\n");

        const mensagem = `*AGENDA*\n\n---------------\n\n${resumo}\n\nPara *confirmar* a presença, digite */confirmar Id*\n\nPara *Detalhe* do role, digite */info Id*\n\nPara *Desconfirmar* a presença, digite */miar Id*`;

        client.sendMessage(message.from, mensagem);
    }
}
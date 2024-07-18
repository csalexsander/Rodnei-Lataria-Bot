import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../../interface/observers/IMessageObserver";
import ComandosConstantes from "../../constantes/comandosConstantes";
import RolesRepository from "../../repositorios/rolesRepository";
import Contexto from "../../database/context";
import UtilMessage from "../../utils/utilMessage";
import ParticipanteRoleRepository from "../../repositorios/participanteRoleRepository";
import ParticipanteRole from "../../entidades/participanteRole";

const comandos = [ComandosConstantes.confirmar, ComandosConstantes.miar];

export default class ParticipacaoObserver implements IMessageObserver {
    private repositorio: RolesRepository;
    private participanteRepository: ParticipanteRoleRepository;

    constructor(contexto: Contexto) {
        this.repositorio = new RolesRepository(contexto);
        this.participanteRepository = new ParticipanteRoleRepository(contexto);
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (!comandos.some(x => x === comando))
            return;

        const corpo = UtilMessage.ObterCorpoMensagem(message);
        if (!corpo) {
            client.sendMessage(message.from, "É necessário informar o ID do role", { quotedMessageId: message.id._serialized });
            return;
        }

        const sequencial = parseInt(corpo?.trim() ?? "");
        if (!sequencial || isNaN(sequencial)) {
            client.sendMessage(message.from, "Informe apenas o ID do role", { quotedMessageId: message.id._serialized });
            return;
        }

        const contato = await message.getContact();

        if (!contato || !contato.id._serialized)
            return;

        const role = await this.repositorio.obterRolePorSequencial(sequencial.toString());

        if (!role) {
            client.sendMessage(message.from, `Role de id ${sequencial} não existe ou foi excluido, consulte novamente os roles para verificar a existencia do ID`, { quotedMessageId: message.id._serialized });
            return;
        }

        let participante = await this.participanteRepository.obterParticipanteRole(role.id, contato.id._serialized);

        let validacao = this.validarParticipanteExistente(participante, comando);
        if (validacao.naoValido) {
            client.sendMessage(message.from, validacao.erro, { quotedMessageId: message.id._serialized });
            return;
        }

        const metodo = comando === ComandosConstantes.confirmar ? "criarParticipanteRole" : "deletarParticipanteRole";

        await this.participanteRepository[metodo](role.id, contato.id._serialized);

        participante = await this.participanteRepository.obterParticipanteRole(role.id, contato.id._serialized);

        validacao = this.validarOperacaoComSucesso(participante, comando);

        client.sendMessage(message.from, validacao.naoValido ? validacao.erro : validacao.mensagem, { quotedMessageId: message.id._serialized });
    }

    private validarParticipanteExistente(participante: ParticipanteRole | null, comando: string): validacaoParticipante {
        const confirmarNaoValido = participante && comando == ComandosConstantes.confirmar;
        const miarNaoValido = !participante && comando == ComandosConstantes.miar;

        const mensagem = comando === ComandosConstantes.confirmar ? "Você já está confirmado no role!" : "Você não está confirmado no role!";

        return { naoValido: confirmarNaoValido || miarNaoValido, mensagem: "", erro: mensagem };
    }

    private validarOperacaoComSucesso(participante: ParticipanteRole | null, comando: string): validacaoParticipante {
        let mensagemSucesso = comando === ComandosConstantes.confirmar ? "Tudo certo!" : "miau...";
        let mensagemFalha = comando === ComandosConstantes.confirmar ? "Ocorreu uma falha ao tentar te confirmar no role" : "Ocorreu uma falha ao tentar miar o role";

        const confirmarNaoValido = !participante && comando == ComandosConstantes.confirmar;
        const miarNaoValido = participante && comando == ComandosConstantes.miar;

        return { naoValido: confirmarNaoValido || (miarNaoValido ?? false), mensagem: mensagemSucesso, erro: mensagemFalha };
    }
}

type validacaoParticipante = {
    naoValido: boolean;
    mensagem: string;
    erro: string;
};
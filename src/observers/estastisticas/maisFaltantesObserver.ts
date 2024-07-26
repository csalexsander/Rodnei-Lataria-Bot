import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../../interface/observers/IMessageObserver";
import Contexto from "../../database/context";
import MensagemRecebidaRepository from "../../repositorios/mensagemRecebidaRepository";
import UtilString from "../../utils/utilString";
import ComandosConstantes from "../../constantes/comandosConstantes";
import UtilChat from "../../utils/utilChat";
import { labels } from "../../constantes/uiConstantes";
import PerfilRepository from "../../repositorios/perfilRepository";
import { random } from "random-unicode-emoji";
import moment from "moment";

export default class MaisFaltantesObserver implements IMessageObserver {
    private readonly mensagemRecebidaRepository: MensagemRecebidaRepository;
    private readonly perfilRespository: PerfilRepository;

    constructor(contexto: Contexto) {
        this.mensagemRecebidaRepository = new MensagemRecebidaRepository(contexto);
        this.perfilRespository = new PerfilRepository(contexto);
    }

    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (!UtilString.compararString(comando, ComandosConstantes.maisFalante))
            return;

        const chat = message.groupMentions && message.groupMentions.length
            ? await client.getChatById(message.groupMentions[0].groupJid)
            : await message.getChat();

        if (!chat)
            return;

        if (!UtilChat.EhChatGrupo(chat)) {
            client.sendMessage(message.from, labels.erro.apenasGrupo);
            return;
        }

        const contact = await message.getContact();

        if (!contact)
            return;

        if (!chat.participants || !chat.participants.length) {
            client.sendMessage(message.from, labels.ranking.botNaoFazParte, { quotedMessageId: message.id._serialized });
            return;
        }

        var participanteGrupo = chat.participants.find(x => x.id._serialized === contact.id._serialized);

        if (!participanteGrupo) {
            client.sendMessage(message.from, labels.ranking.naoFazParte, { quotedMessageId: message.id._serialized });
            return;
        }

        if (!participanteGrupo.isAdmin) {
            client.sendMessage(message.from, labels.ranking.naoEhAdminDoGrupo, { quotedMessageId: message.id._serialized });
            return;
        }

        moment.locale("pt");
        const inicioPeriodo = moment().add(-1, "month").startOf('month');
        const fimPeriodo = moment().add(-1, "month").endOf('month');

        const ranking = await this.mensagemRecebidaRepository.obterRankingMensagens(chat.id._serialized, inicioPeriodo.format('YYYY-MM-DDThh:mm'), fimPeriodo.format('YYYY-MM-DDThh:mm'));
        if (!ranking || !ranking.length) {
            client.sendMessage(message.from, labels.ranking.nenhumDado(inicioPeriodo.format("MMMM").toUpperCase()), { quotedMessageId: message.id._serialized });
            return;
        }

        var perfis = await this.perfilRespository.listarTodosPerfilContato();

        var result = await Promise.all(ranking.map(async x => {
            var perfil = perfis?.find(z => z.contactSerialized == x.contactSerialized);
            if (perfil && perfil.nome) {
                return {
                    nome: perfil.nome,
                    quantidade: x.totalMessages
                };
            }

            var contato = await client.getContactById(x.contactSerialized);

            return {
                nome: UtilString.valorOuNaoInformado(contato?.pushname) ?? UtilString.valorOuNaoInformado(contato.number) ?? x.contactNumber ?? "Nao Encontrado",
                quantidade: x.totalMessages
            };
        }));

        let cabecalho = `*Premio Vai Trabalhar*\r\n\r\n*Edição ${inicioPeriodo.format("MMMM [de] YYYY").toUpperCase()}*\r\nDe ${inicioPeriodo.format("DD/MM/YYYY")} a ${fimPeriodo.format("DD/MM/YYYY")}\r\n\r\n*Grupo: ${chat.name}*\r\n\r\n--------------------------------------------\r\n*🏆\t|${"💬".padStart(6)}\t|  Nome*\r\n--------------------------------------------\r\n`;
        var mensagem = result.map((value, index) => {
            // Limpa o nome dos caracteres indesejados e remove espaços extras
            let nomeLimpo = value.nome.replace(/[^a-zA-Zà-üÀ-Ü\s]/g, "").trim();

            // Cria a linha formatada com o índice e o nome limpo
            let linha = `${this.obterIndex(index + 1)}|${(value.quantidade).toString().padStart(6)}\t| ${nomeLimpo}`;

            if (index <= 2)
                linha = `*${linha}*`;

            return linha;
        }).join("\r\n"); // \n para quebras de linha em mensagens de chat

        client.sendMessage(message.from, cabecalho + mensagem, { quotedMessageId: message.id._serialized });
    }

    private obterIndex(index: number): string {
        switch (index) {
            case 1:
                return "🥇".padEnd(5);
            case 2:
                return "🥈".padEnd(5);
            case 3:
                return "🥉".padEnd(5);
            default:
                return `\`#${(index).toString()}\``.padEnd(6);
        }
    }
}
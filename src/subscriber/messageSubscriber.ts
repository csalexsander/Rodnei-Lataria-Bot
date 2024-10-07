import WAWebJS, { Message } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import UtilMessage from "../utils/utilMessage";
import ComandosConstantes from "../constantes/comandosConstantes";
import Contexto from "../database/context";
import PerfilRepository from "../repositorios/perfilRepository";
import { labels } from "../constantes/uiConstantes";

export default class MessageSubscriber {
    private readonly ComandosObservers: IMessageObserver[];
    private perfilRepository: PerfilRepository;

    constructor(contexto: Contexto) {
        this.ComandosObservers = [];
        this.perfilRepository = new PerfilRepository(contexto);
    }

    CadastrarMessageObservers(observer: IMessageObserver): void {
        this.ComandosObservers.push(observer);
    }

    async NotificarMessageObservers(message: WAWebJS.Message, client: WAWebJS.Client): Promise<void> {
        if (!this.ComandosObservers || this.ComandosObservers.length === 0)
            return;

        let comando = UtilMessage.ObterComando(message);

        if (comando) {
            var processarComando: boolean = await this.ValidarPermissao(comando, message);
            if (!processarComando){
                client.sendMessage(message.from, labels.erro.perfilNaoCriado);
                return;
            }
        }
        else {
            comando = ComandosConstantes.mensagemRecebida;
        }
        
        this.ComandosObservers.forEach(observer => {
            try {
                observer.Executar(comando, message, client)
            }
            catch (e) {
                console.error(`[${observer.constructor.name}] Erro ao processar comando`, e);
            }
        });
    }

    /**
     * Valida se o comando pode ser executado pelo usuário.
     * A validação considera apenas se o contato possui um perfil criado ou não.
     * @param comando 
     * @param mensagem 
     * @returns 
     */
    private async ValidarPermissao(comando: string, mensagem: Message): Promise<boolean> {
        //Ignora validação para /perfil, /regras, e /ajuda
        if (comando === ComandosConstantes.perfil ||
            comando === ComandosConstantes.regras ||
            comando === ComandosConstantes.ajuda
        )
            return true;

        //Se for um comando do BOT:
        if (UtilMessage.EhComandoValido(comando)) {
            const contato = await mensagem.getContact();        
            var perfil = await this.perfilRepository.obterPerfilContato(contato.id._serialized);
            //Se possui perfil completo, permitir processar o comando.
            return perfil != null 
                && perfil.nome != null
                && perfil.relacionamento != null
                && perfil.flerte != null
                && perfil.nascimento != null
                && perfil.orientacao != null
                && perfil.roles != null
                && perfil.melhorlugar != null
                && perfil.insta != null;
        }

        return false;
    }
}
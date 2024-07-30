import { client, cadastrarSubscriber, cadastrarContexto } from "./client/client";
import Contexto from "./database/context";
import AvisoObserver from "./observers/avisoObserver";
import ContadorMsgObserver from "./observers/contadorMsgObserver";
import EntradaObserver from "./observers/entradaObserver";
import OversharingObserver from "./observers/oversharingObserver";
import PassaroObserver from "./observers/passaroObserver";
import PerfilObserver from "./observers/perfil/perfilObserver";
import PerfilViewObserver from "./observers/perfil/perfilViewObserver";
import PerfisObserver from "./observers/perfil/perfisObserver";
import PreencherPerfilObserver from "./observers/perfil/preencherPerfilObserver";
import PongObserver from "./observers/pongObserver";
import PorcentagemObserver from "./observers/porcentagemObserver";
import InfoObserver from "./observers/roles/infoObserver";
import NovoObserver from "./observers/roles/novoObserver";
import ParticipacaoObserver from "./observers/roles/participacaoObserver";
import PreenchimentoObserver from "./observers/roles/preenchimentoObserver";
import EditarRemoverObserver from "./observers/roles/editarRemoverObserver";
import RolesObserver from "./observers/roles/rolesObserver";
import SaidaObserver from "./observers/saidaObserver";
import SortearObserver from "./observers/sortearObserver";
import SorteioObserver from "./observers/sorteioObserver";
import MessageSubscriber from "./subscriber/messageSubscriber";
import NotificationSubscriber from "./subscriber/notificationSubscriber";
import LuvaObserver from "./observers/luvaOberserver";
import OJogoObserver from "./observers/ojogoOberver";
import PiadaObserver from "./observers/piadaObserver";
import RegrasObserver from "./observers/regrasObserver";
import AjudaObserver from "./observers/ajudaObserver";
import StickerObserver from "./observers/stickerObserver";
import MaisFaltantesObserver from "./observers/estastisticas/maisFaltantesObserver";
import MarcosObserver from "./observers/marcosObserver";

const contexto = new Contexto();

cadastrarContexto(contexto);

const messageSubscriber = new MessageSubscriber();

messageSubscriber.CadastrarMessageObservers(new PongObserver());
messageSubscriber.CadastrarMessageObservers(new PorcentagemObserver());
messageSubscriber.CadastrarMessageObservers(new SorteioObserver());
messageSubscriber.CadastrarMessageObservers(new AvisoObserver());
messageSubscriber.CadastrarMessageObservers(new PassaroObserver());
messageSubscriber.CadastrarMessageObservers(new OversharingObserver());
messageSubscriber.CadastrarMessageObservers(new SortearObserver());
messageSubscriber.CadastrarMessageObservers(new LuvaObserver());
messageSubscriber.CadastrarMessageObservers(new OJogoObserver());
messageSubscriber.CadastrarMessageObservers(new PiadaObserver());
messageSubscriber.CadastrarMessageObservers(new MaisFaltantesObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new InfoObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new RolesObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new NovoObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new ParticipacaoObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new EditarRemoverObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new PreenchimentoObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new PerfilObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new PerfisObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new PerfilViewObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new ContadorMsgObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new PreencherPerfilObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new RegrasObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new AjudaObserver(contexto));
messageSubscriber.CadastrarMessageObservers(new StickerObserver(contexto));

const notificationSubscriber = new NotificationSubscriber();

notificationSubscriber.CadastrarNotificationObservers(new EntradaObserver());
notificationSubscriber.CadastrarNotificationObservers(new SaidaObserver());

cadastrarSubscriber(messageSubscriber, notificationSubscriber);

client.initialize();
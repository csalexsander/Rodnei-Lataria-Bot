import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import UtilMatematica from "../utils/utilMatematica";
import ComandosConstantes from "../constantes/comandosConstantes";
import Contexto from "../database/context";
import UtilString from "../utils/utilString";

export default class RegrasObserver implements IMessageObserver {

    constructor(contexto: Contexto) {
    }

    Executar(comando: string, message: Message, client: Client): void {
            
        const regrasInfo : string =
            "*REGRAS BÁSICAS*\n" +
            "\n" +
            "- São proibidos comentários e atitudes machistas, racistas, assédio e falta de respeito de qualquer tipo tanto no grupo quanto em mensagem privada ou em ambiente não digital. Por favor, comunique qualquer agressão nesse sentido que tenha sofrido no grupo, no privado ou em algum rolê à administração imediatamente.  \n" +
            "\n" +
            "- A fim de manter o foco do grupo nos rolês e amizades é enfaticamente incentivado que os usuários compareçam em pelo menos 1 rolê no máximo 2 meses após sua entrada. Caso não seja possível favor conversar com a moderação.\n" +
            "\n" +
            "- Sem pornografia ou gore no chat, nem todos compartilham do mesmo gosto (duvidoso).\n" +
            "\n" +
            "- Todas as infrações são passíveis de expulsão imediata caso sejam graves, do contrário a mensagem será apenas apagada e o infrator advertido. \n" +
            "\n" +
            "*DA MODERAÇÃO*\n" + 
            "\n" +
            "- Antes de mais nada, lembre-se: a moderação tem autoridade de fato apenas dentro dessa restrita esfera digital e embora haja um clima de camaradagem já estabelecido esse ainda é UM GRUPO PÚBLICO, não dê confiança a ninguém maior do que você daria a qualquer amigo digital e analise qualquer convite para eventos privados com a atenção devida. A administração não é polícia (ainda bem) e não tem qualquer poder real no mundo.         \n" +
            "\n" +
            "- A moderação não se presta a solucionar conflitos interpessoais entre os membros, favor resolver suas desavenças entre si.\n" +
            "\n" +
            "*BOA CONVIVÊNCIA*\n" +
            "\n" +
            "- Novo no grupo e não sabe como se enturmar? Muita mensagem? Não se preocupe, apenas pegue o bonde andando e entre no assunto do momento!\n" +
            "\tCaso se sinta meio perdido, um Admin sempre poderá te ajudar, nosso PV é aberto! \n" +
            "\n" +
            "- Para saber dos rolês marcados, digite no chat “/roles”.\n" +
            "\n" +
            "- A grande maioria dos rolês são abertos, sinta-se à vontade para participar ou perguntar para quem organizou. Ninguém vai te morder!\n" +
            "\n" +
            "- Caso vá no seu primeiro rolê, lembre-se de prestar atenção nas informações do grupo, aproveitar bastante, mas com moderação quanto ao que consumir (dar PT só na urna ok?).\n" +
            "\n" +
            "- Quer organizar um rolê? Utilize a função: “/novo” no chat. Siga os passos e não esqueça dos detalhes – e da organização\n" +
            "\n" +
            "- Mais funções do nosso maravilhoso Bot podem ser acessadas com a função “/ajuda”.";
        
        if (!UtilString.compararString(comando, ComandosConstantes.regras))
            return;
       
       client.sendMessage(message.from, regrasInfo);
    }

}


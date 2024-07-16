import { Message, Client } from "whatsapp-web.js";
import IMessageObserver from "../interface/observers/IMessageObserver";
import UtilMatematica from "../utils/utilMatematica";
import ComandosConstantes from "../constantes/comandosConstantes";

export default class InfoObserver implements IMessageObserver {

    Executar(comando: string, message: Message, client: Client): void {
            
        const regrasInfo : string =
        "**REGRAS**" +
        "\n\n" +
        "\t\t- Proibidos comentários e atitudes machistas, racistas, assédio e falta de respeito de qualquer tipo. Passível de ban!" +
        "" +
        "\t\t- Para manter o grupo com objetivo de ser para rolês e amizades, é necessário que os usuários compareçam em pelo menos 1 rolê num período de 2 meses. Caso isso não seja possível no momento, favor conversar com a moderação." +
        "" +
        "\t\t- Quer trazer algum amigo para o grupo? Chame para algum rolê e fale com um Admin." +
        "" +
        "\t\t- Sem pornografia ou gore no chat, nem todos compartilham do mesmo gosto (duvidoso)." +
        "" +
        "**BOA CONVIVÊNCIA**" +
        "" +
        "\t\t- Novo no grupo e não sabe como se enturmar? Muita mensagem? Não se preocupe, apenas pegue o bonde andando e entre no assunto do momento!" +
        "Caso se sinta meio perdido, um Admin sempre poderá te ajudar, nosso PV é aberto!" +
        "" +
        "\t\t- Para saber dos rolês marcados, digite no chat “/roles”." +
        "" +
        "\t\t- A grande maioria dos rolês são abertos, sinta-se à vontade para participar ou perguntar para quem organizou. Ninguém vai te morder!" +
        "" +
        "\t\t- Caso vá no seu primeiro rolê, lembre-se de prestar atenção nas informações do grupo, aproveitar bastante, mas com moderação quanto ao que consumir (dar PT só na urna ok?)." +
        "" +
        "\t\t- Criar amizades com pessoas do grupo é um processo natural, mas tenha bom senso: nada de enviar mensagens indevidas no privado do amiguinho. Assédio mesmo fora do grupo será passível de ban." +
        "" +
        "\t\t- Qualquer situação desconfortável que tenha sofrido no grupo, fora dele ou em algum rolê, fale com um admin." +
        "" +
        "\t\t- Quer organizar um rolê? Utilize a função: “/novo” no chat. Siga os passos e não esqueça dos detalhes – e da organização!" +
        "" +
        "\t\t- Mais funções do nosso maravilhoso Bot podem ser acessadas com a função “/ajuda”."

        if(comando != ComandosConstantes.regras)
            return;
       
       client.sendMessage(message.from, regrasInfo);
    }

}


import WAWebJS from "whatsapp-web.js";

export default interface IMessageObserver {
    Executar(comando : string, message : WAWebJS.Message, client : WAWebJS.Client) : void
}
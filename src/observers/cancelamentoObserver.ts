import { Client, MessageMedia, Message } from "whatsapp-web.js";
import sharp from "sharp";
import ComandosConstantes from "../constantes/comandosConstantes";
import UtilString from "../utils/utilString";
import IMessageObserver from "../interface/observers/IMessageObserver";
import UtilMessage from "../utils/utilMessage";

const proibido_png = 'src/assets/images/proibido.png';

export default class CancelamentoObserver implements IMessageObserver {
    async Executar(comando: string, message: Message, client: Client): Promise<void> {
        if (!UtilString.compararString(comando, ComandosConstantes.cancelar))
            return;

        const participantesId = UtilMessage.ListarParticipanteId(message)
            .slice(0, 1); // Devido a alta chance de rolar flood, limitando as menções a somente uma pessoa

        for (const participanteId of participantesId) {
            const fotoPerfilUrl = await client.getProfilePicUrl(participanteId);

            if (!fotoPerfilUrl){
                const contact = await client.getContactById(participanteId);
                client.sendMessage(message.from, `🚫 @${contact.id.user} 🚫`, { mentions: [participanteId] });
                continue;
            }

            const res = await fetch(fotoPerfilUrl);
            const data = await res.arrayBuffer();

            const fotoPerfilModificada = await sharp(data)
                .resize(480, 480)
                .composite([{ input: proibido_png, gravity: 'center' }])
                .toBuffer()

            const media = new MessageMedia('image/png', fotoPerfilModificada.toString('base64'));

            if (media != null) {
                client.sendMessage(message.from, media, {
                    sendMediaAsSticker: true,
                    stickerAuthor: '[Galerinha Bot]'
                });
            }
        }
    }
}

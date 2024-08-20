import puppeteer from 'puppeteer';
import fs from 'fs';
import marked from 'marked';

export default class UtilMensagemSticker {
    static async gerarImagem(arrayMensagens: any) {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        const html = fs.readFileSync('src/assets/static/index.html', 'utf8');
        await page.setContent(html);

        arrayMensagens = arrayMensagens.map((e: { mensagem: any; }) => {
            return {
              ...e,
              mensagem: marked.parseInline(this.formatMessage(e.mensagem))
            };
          });

          await page.evaluate((arrayMensagens) => {
            const targetDiv = document.querySelector('#conversation');

            const cores = ['lightgreen', 'lightblue', 'lightyellow'];

            arrayMensagens.forEach((elemento, indice) => {
              targetDiv.innerHTML += `
              <div class="message received">
                    <svg class="avatar" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                      <rect width="48" height="48" fill="${cores[indice]}"/>
                      <text x="50%" y="50%" dominant-baseline="middle" fill="white" font-family="Arial, sans-serif" font-size="18" text-anchor="middle">${elemento.usuario[0]}</text>
                      <image href="${elemento.imagem}" width="48" height="48" onerror="this.style.display='none'" />
                    </svg>
                    <img style="display:none;" src="${elemento.imagem}" />
                    <span class="username" style="color: ${cores[indice]}">${elemento.usuario}</span>
                    <span>${elemento.mensagem}</span>
                    <span class="metadata"><span class="time">${elemento.horaMensagem}</span></span>
              </div>
              `;
            });
          }, arrayMensagens);

          const divElement = await page.$('#conversation');

          const box = await divElement.boundingBox();

          await page.waitForFunction(() => {
            const images = Array.from(document.querySelectorAll('img'));
            return images.every(img => img.complete);
          });

          const image = await page.screenshot({
            clip: {
              x: box.x,
              y: box.y,
              width: box.width,
              height: box.height
            },
            omitBackground: true
          });

          await browser.close();

          return image;
    }

    static formatMessage(message: string): string {
      const maxLength = 200;

      if (message.length > maxLength) {
          const truncatedMessage = message.substring(0, maxLength) + '...';
          const lerMaisSpan = ` <span style="color: lightblue;">Ler mais</span>`;
          return `${truncatedMessage}${lerMaisSpan}`;
      } else {
          return message;
      }
  }
}

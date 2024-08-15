FROM node:lts

RUN apt -y update

# Dependências do puppeteer
RUN apt -y install gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 \
    libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
    libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
    libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 \
    libnss3 lsb-release xdg-utils wget

# Dependências extras
RUN apt -y install ffmpeg fonts-noto-color-emoji

WORKDIR /app

# Copia arquivos de controle de dependências do nome
COPY package*.json ./

# Instala dependências do node
RUN npm install

# Copia o restante da aplicação
COPY . .

# Inicia a aplicação
CMD ["npm", "start"]

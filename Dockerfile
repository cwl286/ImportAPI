FROM node:17-alpine3.15

# Create app directory
WORKDIR /usr/src/app

#install chromium-browser for puppeteer
RUN  apk add --update chromium

# Create json file from host to the image
COPY package*.json ./

# The image install app dependencies
RUN npm install

# Bundle app source to the image
COPY . . 

# Set environment variables
ENV PORT=3000
ENV CHROME_BIN /usr/bin/chromium-browser
ENV PROXY_SERVER=""
ENV LOG_DIR=""
ENV SESSION_SECRET=cat
ENV SESSION_STORE=REDISno
ENV REDIS_STORE_URL=redis://127.0.0.1:6379

# the app binds to the above PORT or default PORT 3000
EXPOSE 3000

# start apps when the image runs
CMD ["npm","start"]  

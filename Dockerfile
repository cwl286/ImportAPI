FROM node:current-alpine3.14

# Create app directory
WORKDIR /usr/src/app

# 01 Nov 22
# Latest Version chromium: 107.0.5304.87-r0  (https://pkgs.alpinelinux.org/package/edge/community/x86_64/chromium)
# only support by puppeteer:  v18.1.0 (https://github.com/puppeteer/puppeteer/releases?page=2)
#install chromium-browser for puppeteer
RUN apk add --update chromium

# # Copy json file from host to the image
COPY package*.json ./

# Install app dependencies to the image
RUN npm install

# Bundle app source to the image
COPY . . 

# Set environment variables
# CHROME_BIN is neccessary for puppeteer 
ENV CHROME_BIN /usr/bin/chromium-browser 
ENV NODE_ENV=production

ENV PORT=3000 
# the app binds to the above PORT or default PORT 3000
EXPOSE 3000  

# install chromium manually
# RUN node node_modules/puppeteer/install.js

# start apps when the image runs
CMD ["npm","start"]  

FROM node:current-alpine3.14

# Create app directory
WORKDIR /usr/src/app

#install chromium-browser for puppeteer
RUN  apk add --update chromium

# Copy json file from host to the image
COPY package*.json ./

# Install app dependencies to the image
RUN npm install

# Bundle app source to the image
COPY . . 

# Set environment variables
# CHROME_BIN is neccessary for puppeteer 
ENV CHROME_BIN /usr/bin/chromium-browser 
ENV PORT=3000

# the app binds to the above PORT or default PORT 3000
EXPOSE 3000

# start apps when the image runs
CMD ["npm","start"]  


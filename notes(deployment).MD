#### Deployment  <br/>
######*HEROKU*   (deploy without REDIS) <br/>
1. Clone this responsitory to your GitHub
2. Register an account [https://www.heroku.com/](https://www.heroku.com/) <br/>
3. Create *New App* with your *App name* and *region*
    - In *Setting* tab, add [https://github.com/jontewks/puppeteer-heroku-buildpack](https://github.com/jontewks/puppeteer-heroku-buildpack) to *add buildpack* in *Buildpacks*
    Connet your *New App* to your GitHub
    - In *Deploy* tab, conect to your GitHub clone respository
    - In *Setting* tab, you can configure your *Domains*
    - In *Deploy/Manual deploy* tab, deploy branch.
    - HEROKU will build automatically

&emsp;(To create and manage Heroku apps directly from the terminal) <br/>
1. Download [The Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) 
    - Check heroku 
    `$ heroku --version`
    - Check git 
    `$ git --version`
2. Login in terminal `$ heroku login -i`
    - To check logs: 
    ```$ heroku logs -t -a=<New App Name>```
    - To test build and run it locally ([http://localhost:3000/](http://localhost:3000/)): 
    ```$ heroku local web```
    - To see all the preset Heroku environment variables
    ```heroku run printenv```
    - [https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true](https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true)


######*docker*   (deploy without REDIS) <br/>
1. Start Docker daemon
2. Go to the directory of *Dockerfile*.
3. To build a docker image (dot at the end is a must).
`$ docker build -t <YOUR_IMAGE_NAME> .`
4. Run the docker image by typing 
`$ docker run -d --rm -p 3000:3000  <YOUR_IMAGE_NAME>`
    - *3000:3000* refers to *<HOST_PORT>:<IMAGE_PORT>*, where in *Dockerfile*, *<IMAGE_PORT>* is defined as *ENV PORT=3000* and then *EXPOSE 3000*.
    - To test build and run it locally ([http://localhost:3000/](http://localhost:3000/))

######*docker compose*   (deploy with REDIS) <br/>
1. Start Docker daemon
2. Go to the directory of *docker-compose.yml*.
3. Type `$ docker compose up --build` in terminal to build docker images
    - To test build and run it locally ([http://localhost:3000/](http://localhost:3000/))
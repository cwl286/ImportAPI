## ImportAPI

**Language** nodejs <br/>
**Objective** <br/>
Create a simple API to mimic google sheet's *importhtml()* and *importxml()*. <br/>
Try to avoid Cloudflare <br/>
**Background** Google Apps Script's *fetch()* does not allow the change *User-Agent*, and hence it has been blocked by many sites. <br/>

**Usage Example** <br/>
*importhtml()*
> GET: [/api/v1/importhtml?apikey=XXXXX&url=https//:www.yourwebsite.com&tag=table&index=0]() <br/>
> POST: [/api/v1/importhtml]() <br/> 
```
// In request body 
{ "apikey":"XXXXX", "url":"https//:www.yourwebsite.com", "tab":"table","indes":"0"}
```
    
- url – The URL of the page to be examined, including protocol (e.g. http://).   
- tag – html DOM tag e.g. "body", "table", "list", depending on what type of structure contains the desired data.
- index *(optional)* – The index, starting at zero 0, which identifies which e.g. table or list as defined in the HTML source should be returned.
    
*importxml()*
> GET: [/api/v1/importxml?apikey=XXXXX&url=https//:www.yourwebsite.com&query=//table]()<br/>
> POST: [/api/v1/importxml]() <br/>
```  
// In request body 
{ "apikey":"XXXXX", "url":"https//:www.yourwebsite.com", "query":"//table"}
``` 
- url – The URL of the page to be examined, including protocol (e.g. http://).   
- query – The XPath query to be run on the structured data.  

**API Respones** 
```
//In json format
{isSussess:boolean, result:""}
```
**Packages**
- Application framework: express 
- Authentication: passport
- Code Formatter: eslint
- Logging: morgan
- Parsing: xmldom, xpath, puppeteer
- Session: express-session, helmet
- Session store: redis
- Testing: chia, mocha, sinon, nyc

**To use**
1. Install packages in package.json
2. Install redis, start redis
3. Configure the environment . Only if *SESSION_STORE=REDIS* in .env file or *process.env.SESSION_STORE=REDIS*, redis is used to store session
```
PORT=3000
LOG_DIR=""
SESSION_SECRET=cat
SESSION_STORE=REDIS
REDIS_STORE_URL=redis://127.0.0.1:6379
```
4. In terminal, type `npm start` to run
5. In terminal, type `npm start` to test


**Folder structure** <br/>
App <br/>
├──config <br/> 
├──controllers <br/> 
&emsp;└──authorization <br/>
&emsp;└──aux <br/>
&emsp;└──fetch <br/>
&emsp;└──routes <br/>
├──logger <br/> 
├──models <br/> 
Test <br/>
.env <br/>


**Deployment** <br/>
*HEROKU*   (deploy without REDIS) <br/>
1. Clone this responsitory to your GitHub
2. Register an account [https://www.heroku.com/](https://www.heroku.com/) <br/>
3. Create *New App* with your *App name* and *region*
    - Connet your *New App* to your GitHub
    - In *Deploy* tab, conect to your GitHub clone respository
    - In *Setting* tab, add [https://github.com/jontewks/puppeteer-heroku-buildpack](https://github.com/jontewks/puppeteer-heroku-buildpack) to *add buildpack* in *Buildpacks*
    - IN *Setting* tab, you can configure your *Domains*
    - HEROKU will build automatically

(To create and manage Heroku apps directly from the terminal) <br/>
1. Download [The Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) 
    - Check heroku `heroku --version`
    - Check git `git --version`
2. Login in terminal `heroku login -i`
    - To check logs: `heroku logs -t -a=<New App Name>`
    - To test build and run it locally ([http://localhost:3000/](http://localhost:3000/)): `heroku local web`

[HEROKU Reference](https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true)

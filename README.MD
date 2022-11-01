## ImportAPI

**Language** nodejs <br/>
**Objective** <br/>
- v1: Create a simple API to mimic google sheet's *importhtml()* and *importxml()*. <br/>
- v1: Try to avoid Cloudflare <br/>

**Background** Google Apps Script's *fetch()* does not allow the change *User-Agent*, and hence it has been blocked by many sites. <br/>

### Usage Example <br/>
**importhtml**
> GET/POST : [/api/v1/importhtml?apikey=XXXXX&url=https//:www.yourwebsite.com&tag=table&index=0]() 
    
- url – The URL of the page to be examined, including protocol (e.g. http://).   
- tag – html DOM tag e.g. "body", "table", "list", depending on what type of structure contains the desired data.
- index *(optional)* – The index, starting at zero 0, which identifies which e.g. table or list as defined in the HTML source should be returned.

```
// JSON response: HTML element(s)
e.g. {isSussess:boolean, result:"<table></table>"}
```
    
**importxml**
> GET/POST: [/api/v1/importxml?apikey=XXXXX&url=https//:www.yourwebsite.com&query=//table]() 
 
- url – The URL of the page to be examined, including protocol (e.g. http://).   
- query – The XPath query to be run on the structured data.  

```
// JSON response: HTML element(s)
e.g. {isSussess:boolean, result:"<table></table>"}
```


**importjson**
> GET/POST: [/api/v1/importxml?apikey=XXXXX&url=https//:www.yourwebsite.com]() 

- url – The URL of json.   

### Packages
- Application framework: express 
- Authentication: passport
- Code Formatter: eslint
- Logging: morgan, winston
- Parsing: xmldom, xpath-html, puppeteer, axios
- Session: express-session, helmet
- Session store: redis
- Testing: chia, mocha, sinon, nyc

### How to try locally
1. Install packages in package.json
2. In terminal, type `$ npm start` to run
3. In terminal, type `$ npm test` to test


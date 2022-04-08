## ImportAPI

**Language** nodejs <br/>
**Objective** <br/>
- v1: Create a simple API to mimic google sheet's *importhtml()* and *importxml()*. <br/>
- v1: Try to avoid Cloudflare <br/>
- v2: Query profiles, ratios and metrics of various company

**Background** Google Apps Script's *fetch()* does not allow the change *User-Agent*, and hence it has been blocked by many sites. <br/>

### Usage Example <br/>
**importhtml**
> GET: [/api/v1/importhtml?apikey=XXXXX&url=https//:www.yourwebsite.com&tag=table&index=0]() 

> POST: [/api/v1/importhtml]()
> In request body: { "apikey":"XXXXX", "url":"https//:www.yourwebsite.com", "tab":"table","index":"0"}
    
- url – The URL of the page to be examined, including protocol (e.g. http://).   
- tag – html DOM tag e.g. "body", "table", "list", depending on what type of structure contains the desired data.
- index *(optional)* – The index, starting at zero 0, which identifies which e.g. table or list as defined in the HTML source should be returned.

```
// JSON response: HTML element(s)
e.g. {isSussess:boolean, result:"<table></table>"}
```
    
**importxml**
> GET: [/api/v1/importxml?apikey=XXXXX&url=https//:www.yourwebsite.com&query=//table]() 

> POST: [/api/v1/importxml]() 
> // In request body: { "apikey":"XXXXX", "url":"https//:www.yourwebsite.com", "query":"//table"}
 
- url – The URL of the page to be examined, including protocol (e.g. http://).   
- query – The XPath query to be run on the structured data.  

```
// JSON response: HTML element(s)
e.g. {isSussess:boolean, result:"<table></table>"}
```

**queryprofile**
> GET: [/api/v2/importprofile?apikey=XXXXX&ticker=aapl]()

> POST: [/api/v2/importprofile]()
> // In request body: { "apikey":"XXXXX", "ticker:aapl"}
 
- ticker – stock ticker e.g. AAPL, MSFT

```
// JSON response
{   isSussess:boolean, 
    result: {
        "type": "stocks",
        "ticker": "AAPL",
        "name": "Apple",
        "nameFull": "Apple Inc.",
        "exchange": "NASDAQ",
        ...
        }
}
```

**queryticker**
> GET: [/api/v2/queryticker?apikey=XXXXX&ticker=aapl]()

> POST: [/api/v2/queryticker]()
> // In request body: { "apikey":"XXXXX", "ticker:aapl"}
 
- ticker – stock ticker e.g. AAPL, MSFT

```
// JSON response in terms of million
{   isSussess:boolean, 
    result: {
            "finviz": {
            ...},
            "shortvolume": {
            ...},
            "stockanalysis": {
            ...},
            "marketwatch": {
            ...},
        }
}
```

**queryticker (current quarter)**
> GET: [/api/v2/queryticker/current?apikey=XXXXX&ticker=aapl]()

> POST: [/api/v2/queryticker/current]()
> // In request body: { "apikey":"XXXXX", "ticker:aapl"}
 
- ticker – stock ticker e.g. AAPL, MSFT

```
// JSON response in terms of million
{   isSussess:boolean, 
    result: {
            "finviz": {
            ...},
            "shortvolume": {
            ...},
            "stockanalysis": {
            ...},
            "marketwatch": {
            ...},
        }
}
```


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
2. Install redis, start redis
3. Configure the environment . Only if *SESSION_STORE=REDIS* in .env file or *process.env.SESSION_STORE=REDIS*, redis is used to store session
```
PORT=3000
LOG_DIR=""
SESSION_SECRET=cat
SESSION_STORE=REDIS
REDIS_URL=redis://127.0.0.1:6379
```
4. In terminal, type `$ npm start` to run
5. In terminal, type `$ npm start` to test


### Folder structure  <br/>
App <br/>
├──config <br/> 
├──controllers <br/> 
&emsp;└──authorization <br/>
&emsp;└──aux <br/>
&emsp;error <br/>
&emsp;└──fetch <br/>
&emsp;logger <br/>
&emsp;└──routes <br/>
&emsp;├──logger <br/> 
├──models <br/> 
Test <br/>
Logs <br/>


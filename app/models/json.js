const http = require('http');
const https = require('https');
/**
 * download json
 * @param {string} url 
 * @return {Object}  json
 */
const getJson = async function (url) {
    
    let mid = null;

    if (url.includes('https')) 
        mid = https
    else
        mid = http

    console.log(url);
    mid.get(url, (res) => {
        let body = "";

        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end", () => {
            try {
                let json_data = JSON.parse(body);

                console.log('json_data: ' ,json_data);
                return json;
            } catch (error) {
                console.error(error.message);
            };
        });

    }).on("error", (error) => {
        console.error(error.message);
    });

    return null;
};

module.exports = {
    getJson: getJson
};

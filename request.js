let request = require('request');
let AsyncLogger = require('./logger');


class Request {

    constructor() {
        this.options = {
            headers: {
                'User-Agent': 'request'
            }
        };
    }

    get(url) {
        let options = Object.assign({ url }, this.options);

        return new Promise((resolve, reject) => {
            let logger = AsyncLogger.instance();


            request(options, function(error, response, body) {
                
                if(error) {
                    
                    reject(error);
                } else {
                    logger.api(`Getting api: ${url}, SUCCESS`);

                    if(response.statusCode === 200) {
                        resolve(body);
                    } else {
                        logger.api(`Getting api: ${url}, ERROR, ${response.statusCode}, ${JSON.parse(body).message}`);
                        reject(body);
                    }
                }
            });
        });
    }
}

module.exports = new Request();
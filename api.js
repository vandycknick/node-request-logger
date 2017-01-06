let AsyncLogger = require('./logger');
let request = require('./request');

class GithubApi {

    search(...args) {
        let logger = AsyncLogger.instance();
        logger.log(`calling GithubApi:search(${args.join(',')})`)
        return request.get('https://api.github.com/search/repositories?q=preact+language:javascript&sort=stars&order=desc')
            .then(data => JSON.parse(data))
    }

}

module.exports = {
    github: new GithubApi()
};
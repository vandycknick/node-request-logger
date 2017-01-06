'use strict';

require('zone.js');

let http = require('http');
let express = require('express');
let AsyncLogger = require('./logger');
let requestId = require('./request-id');
let api = require('./api');
let github = api.github;

let app = express();

app.use(requestId())

app.use(AsyncLogger.middleware());

app.use('/', function(req, res) {
    let logger = AsyncLogger.instance();

    github.search('preact')
        .then(function(data) {
            let result = '';
            data.items.forEach((item, count) => {
                result += `<li>${count}. ${item.name} </li>\n`;
            });

            res.send(`
                <div>Total results found: ${data.total_count}</div>

                <ul>
                    ${result}
                </ul>
            `);
        })
        .catch(function() {
            res.send('Oeps something happened');
        });
});


let server = http.createServer(app);

server.on('listening', function() {
    console.log(`Server listening on port: ${server.address().port}`)
});

server.on('error', function(err) {
    console.log('Oeps', err);
});

server.listen(3000);
 
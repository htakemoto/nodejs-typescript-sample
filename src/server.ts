/// <reference path='../typings/main.d.ts' />

import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
var morgan = require('morgan');
import test from './routes/test';
import logger from './utils/logger';


class Main {
    express: express.Express;
    port: number;

    constructor() {
        this.express = express();
        this.port = process.env.PORT || 3000;
        this.express.set('port', this.port);

        // access log
        this.express.use(morgan('combined', {
            stream: {
                write: function(message, encoding) {
                    logger.info(message);
                }
            }
        }));

        this.express.use(bodyParser.urlencoded({extended: true}));
        this.express.use(bodyParser.json());
        this.express.use(cors());

        // routing
        this.express.use('/test', test);

        // error handler
        this.express.use(function(err: any, req:express.Request, res:express.Response, next:express.NextFunction) {
            res.status(err.status || 500);
            var message = {
                "status": err.status,
                "message": err.message
            };
            logger.error(JSON.stringify(message));
            res.send(message);
        });
    }

    public start(): void {
        const server = http.createServer(this.express).listen(this.express.get('port'), function () {
            let port = server.address().port;
            logger.info('listening in http://localhost:' + port);
        });
    }
}

var main: Main = new Main();
main.start();

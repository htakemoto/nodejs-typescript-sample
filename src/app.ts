/// <reference path='../typings/index.d.ts' />

import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
var morgan = require('morgan');
import test from './routes/test';
import logger from './utils/logger';


class App {

    public static run() {
        let exp = express();
        let port = process.env.PORT || 3000;
        exp.set('port', port);

        // access log
        exp.use(morgan('combined', {
            stream: {
                write: function (message, encoding) {
                    logger.info(message);
                }
            }
        }));

        exp.use(bodyParser.urlencoded({ extended: true }));
        exp.use(bodyParser.json());
        exp.use(cors());

        // routing
        exp.use('/test', test);

        // error handler
        exp.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            res.status(err.status || 500);
            let message = {
                "status": err.status,
                "message": err.message
            };
            logger.error(JSON.stringify(message));
            res.send(message);
        });

        const server = http.createServer(exp).listen(exp.get('port'), function () {
            let port = server.address().port;
            logger.info('listening in http://localhost:' + port);
        });
    }
}

App.run();

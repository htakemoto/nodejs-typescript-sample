import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
var morgan = require('morgan');
import testController from './routes/test';
import logger from './utils/logger';

class App {

    public static run() {
        let app = express();
        let router = express.Router();
        let port = process.env.PORT || 3000;
        app.set('port', port);

        // access log
        app.use(morgan('combined', {
            stream: {
                write: function (message: any, encoding: any) {
                    logger.info(message);
                }
            }
        }));

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(cors());

        // routing
        router.post('/test', testController.getToken);
        router.get('/test', testController.checkAuth);
        app.use('/', router);

        // error handler
        app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            logger.error(err.stack)
            res.status(err.status || 500);
            let message = {
                "status": err.status,
                "message": err.message
            };
            logger.error(JSON.stringify(message));
            res.send(message);
        });

        const server = http.createServer(app);
        server.listen(app.get('port'), function () {
            let port = server.address().port;
            logger.info('listening in http://localhost:' + port);
        });
    }
}

App.run();

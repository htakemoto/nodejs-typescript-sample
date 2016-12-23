import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import Ping from '../utils/ping';
import Jwt from '../utils/jwt';
import User from '../models/user';

class TestController {

    // url: [POST] /test
    // payload: {"username":"admin","password":"secret"}
    public async getToken(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        var user: User = new User(req.body.username, req.body.password, 'test@sample.com');
        logger.info("user: %s", JSON.stringify(user));

        // authenticate user
        if (user.username == null || user.password == null) {
            var error: { status?: number } = new Error("username or password is wrong");
            error.status = 401;
            return next(error);
        }

        let token = Jwt.generateToken(user);

        res.json({ token: token });
    }

    // url: [GET] /test
    // headers: 'Authorization':'YOURTOKEN'
    public async checkAuth(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        var token = req.headers['authorization'];
        logger.info(token);

        let decoded;
        // just do fake pings without any reason
        var ping = new Ping();
        try {
            await ping.ping();
        } catch (err) {
            let error: { status?: number } = new Error(err.message);
            error.status = 500;
            return next(error);
        }

        // validate token
        try {
            decoded = await Jwt.validateJwt(token);
            logger.debug(decoded);
        } catch (err) {
            logger.error(err);
            if (err.name == 'TokenExpiredError') {
                err.message = 'Access token has been expired'
            }
            let error: { status?: number } = new Error(err.message);
            error.status = 401;
            return next(error);
        }
        res.json({ message: 'authorized' });
    }
}

export default new TestController();
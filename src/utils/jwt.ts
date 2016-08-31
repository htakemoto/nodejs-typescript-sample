import * as jwt from 'jsonwebtoken';
import User from '../models/user';

export default class Jwt {
    static jwtSecret: string = "secret";
    static expiresInMinutes: number = 60;

    public static generateToken(user: User): string {
        var claims = {
            usr: user.username,
            email: user.email,
            exp: Math.floor(new Date().getTime() / 1000) + (this.expiresInMinutes * 60)
        };
        return jwt.sign(claims, this.jwtSecret);
    }

    public static validateJwt(token: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            jwt.verify(token, this.jwtSecret, (err, decoded) => {
                if (err) { reject(err); }
                resolve(decoded)
            })
        });
    }
}

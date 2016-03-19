import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';
import * as _ from 'lodash';

class Logger {
    logger:winston.LoggerInstance

    constructor() {
        winston["emitErrs"] = true;
        this.logger = new winston.Logger({
            transports: [
                new winston.transports.Console({
                    level: 'info',
                    handleExceptions: true,
                    json: false,
                    colorize: false,
                    timestamp: function() { return this.formatCurrentTime(); },
                    formatter: function(args) {
                        var logMessage = this.formatCurrentTime() + '  ' + args.level.toUpperCase() + ': ';
                        if (_.isEmpty(args.meta)) {
                            logMessage += args.message;
                        } else {
                            logMessage += JSON.stringify(args.meta);
                            logMessage += args.message;
                        }
                        return logMessage;
                    }
                })
            ],
            exitOnError: false
        });
    }

    private formatCurrentTime() {
        var date = new Date();
        var month = this.addZero(date.getMonth() + 1, 2);
        var d = this.addZero(date.getDate(), 2);
        var h = this.addZero(date.getHours(), 2);
        var m = this.addZero(date.getMinutes(), 2);
        var s = this.addZero(date.getSeconds(), 2);
        var ms = this.addZero(date.getMilliseconds(), 3);
        return date.getFullYear() + "-" + month + "-" + d + " " + h + ":" + m + ":" + s + "." + ms;
    }

    private addZero(x, n) {
        while (x.toString().length < n) {
            x = "0" + x;
        }
        return x;
    }
}

export default new Logger().logger

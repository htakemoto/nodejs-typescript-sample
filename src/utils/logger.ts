import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';
import * as _ from 'lodash';

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            handleExceptions: true,
            json: false,
            colorize: false,
            timestamp: function () { return formatCurrentTime(); },
            formatter: function (args: any) {
                var logMessage = formatCurrentTime() + '  ' + args.level.toUpperCase() + ': ';
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

function formatCurrentTime() {
    var date = new Date();
    var month = addZero(date.getMonth() + 1, 2);
    var d = addZero(date.getDate(), 2);
    var h = addZero(date.getHours(), 2);
    var m = addZero(date.getMinutes(), 2);
    var s = addZero(date.getSeconds(), 2);
    var ms = addZero(date.getMilliseconds(), 3);
    return date.getFullYear() + "-" + month + "-" + d + " " + h + ":" + m + ":" + s + "." + ms;
}

function addZero(x: any, n: any): string {
    while (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
}

export default logger

const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const dayjs = require('dayjs');
const chalk = require('chalk');
const { AppKeys } = require('../../common/const');

dayjs.extend(utc);
dayjs.extend(timezone);

const colors = {
   error: 'red',
   warn: 'yellow',
   info: 'green',
   http: 'magenta',
   debug: 'redBright'
};

const colorHttp = {
   "[GET]": '#61affe',
   "[POST]": '#49cc90',
   "[PUT]": '#fca130',
   "[DELETE]": '#f93e3e',
   "[PATCH]": '#50e3c2'
};

winston.addColors(colors);
class Logger {
   constructor(logInfo) {
      const label = Object.values(logInfo).join(' ');

      const baseFormat = [
         winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }),
         winston.format.metadata(),
         winston.format.prettyPrint(),
         winston.format.json(),
         winston.format.label({ label }),
      ];

      const transports = [];
      if (process.env.NODE_ENV === AppKeys.ENV_MODE.PROD) {
         transports.push(new winston.transports.DailyRotateFile({
            dirname: path.resolve(global.rootDir, '..', 'logs'),
            filename: 'log-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
         }));
      } else {
         transports.push(new winston.transports.Console({
            format: winston.format.combine(
               ...baseFormat,
               winston.format.printf((info) => {
                  let label = chalk['yellow'](logInfo['logTime']);

                  const logMethod = logInfo['logMethod'];
                  const logStatus = logInfo['logStatus'];
                  const logPath = logInfo['logPath'];
                  if (logMethod) {
                     label += ` ${chalk['hex'](colorHttp[logMethod])(logMethod)}`;
                  }

                  if (logStatus) {
                     let statusColor = colors.http;
                     //Include 4 => error, example 400, 401,...
                     if (logStatus && logStatus.includes('5')) {
                        statusColor = colors.error;
                     }
                     label += ` ${chalk[statusColor](logStatus)}`;
                  }

                  if (logPath) {
                     label += ` ${chalk['hex']('#0000FF')(logPath)}`;
                  }

                  return `${label} ${chalk[colors[info.level]](`[${info.level.toUpperCase()}]:`)} ` +
                     `${chalk['whiteBright'](JSON.stringify(info.message))}`;
               })
            )
         }));
      }

      this.logger = winston.createLogger({
         format: winston.format.combine(
            ...baseFormat,
            winston.format.printf((info) => {
               return `${info.label} [${info.level.toUpperCase()}]: ${JSON.stringify(info.message)}`;
            }),
         ),
         transports
      });
   }

   /**
    * @typedef {'post' | 'get' | 'delete' | 'put' | 'patch'} Method
    * @typedef {'info' | 'error' | 'warn' | 'debug' | 'http'} Level
    * @param {*} data 
    * @param {Level} level 
    * @param {Method} method - HTTP method to use
    * @param {String} path 
    * @param {HTTP Status code} status 
    */
   static writeLog(level = 'info', data, method, path, status) {
      const logInfo = {
         logTime: `[${dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD hh:mm:ss')}]`
      };

      if (method) {
         logInfo['logMethod'] = `[${method}]`;
      }

      if (status) {
         logInfo['logStatus'] = `[${status}]`;
         //Include 4 => error, example 400, 401,...
         if (logInfo['logStatus'].includes('5')) {
            level = 'error';
         } else if (logInfo['logStatus'].includes('4')) {
            level = 'warn';
         }
      }

      if (path) {
         logInfo['logPath'] = `[${path}]`;
      }

      const loggerService = new Logger(logInfo);
      loggerService.logger.log({
         level: level,
         message: data
      });
   }

   static log() {
      // eslint-disable-next-line no-console
      console.log(chalk['yellow'](`[${dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD hh:mm:ss')}]`), ...arguments);
   }
}
module.exports = Logger;
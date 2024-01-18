import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

const customLevelOpt =  { 
    levels:  {
     fatal: 0,
     error: 1,
     warning: 2,
     info: 3,
     debug: 4
    },
    colors: {
     fatal: "red",
     error: "yellow",
     warning: "cyan",
     info: "blue",
     debug: "gray"
     }
    }
    
    const mode = process.env.MODE;

    const transports = [
      new winston.transports.File({
        filename: "./errors.html",
        level: "fatal",
        format: winston.format.simple()
      }),
      new winston.transports.File({
        filename: "./errors.html",
        level: "error",
        format: winston.format.simple()
      }),
      new winston.transports.File({
        filename: "./loggers.html",
        level: "warning",
        format: winston.format.simple()
      }),
      new winston.transports.File({
        filename: "./loggers.html",
        level: "info",
        format: winston.format.simple()
      })
    ];
    
    if (mode === 'development') {
      transports.push(
        new winston.transports.Console({
          level: "debug",
          format: winston.format.combine(
            winston.format.colorize({ colors: customLevelOpt.colors }),
            winston.format.simple()
          )
        })
      );
    }
    
    const logger = winston.createLogger({
      levels: customLevelOpt.levels,
      transports,
    });
    
    export const addLogger = (req, res, next) => {
      req.logger = logger;
      req.logger.debug(`${req.method} es ${req.url} - ${new Date().toLocaleTimeString()} `);
      next();
    };
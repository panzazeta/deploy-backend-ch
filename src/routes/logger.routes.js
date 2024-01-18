import { Router } from "express";
import { addLogger } from "../config/logger.js";

const loggerRouter= Router();

loggerRouter.use(addLogger);

loggerRouter.get('/fatal', (req, res)=>{
    req.logger.info('<span style="color:red">Texto Fatal</span><br/>'),
    res.send("FATAL")
});

loggerRouter.get('/error', (req, res)=>{
    req.logger.info('<span style="color:yellow">Texto Error</span><br/>'),
    res.send("ERROR")
});

loggerRouter.get('/warning', (req, res)=>{
    req.logger.info('<span style="color:cyan">Texto Warning</span><br/>'),
    res.send("WARNING")
});

loggerRouter.get('/info', (req, res)=>{
    req.logger.info('<span style="color:blue">Texto Info</span><br/>'),
    res.send("INFO")
});

loggerRouter.get('/debug', (req, res)=>{
    req.logger.debug("mensaje debug"),
    res.send("DEBUG")
});

export default loggerRouter
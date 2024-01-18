import "dotenv/config"
import express from 'express';
import cors from "cors";
import mongoose from 'mongoose';
import passport from 'passport';
import initializePassport from './config/passport.js';
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import router from "./routes/index.routes.js";
import { messageModel } from './models/message.models.js';
import { __dirname } from "./path.js";
import { Server } from "socket.io";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const whiteList = ["http://localhost:5173"]

const corsOptions = {
    origin: whiteList,
    credentials: true,
};

const app = express()
const PORT = 3000

const serverExpress = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

//BDD
mongoose.connect(process.env.MONGO_URL)
    .then( async () => {
        console.log('BDD conectada')
    })
    .catch(() => console.log('Error en conexion a BDD'))

//Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser(process.env.SIGNED_COOKIE));
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        },
        ttl: 60 

    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//Router
app.use("/", router);

//Middleware autorización
const auth = (req, res, next) => {
    if (req.session.login === true) {
      next();
    } else {
      res.redirect("/login");
    }
  };

//Swagger
const swaggerOptions = {
	definition: {
		openapi: "3.1.0",
		info: {
			title: "Documentación Proyecto Ecommerce Backend",
			description: "API Coder Backend" 
		}
	},
	apis: [`${__dirname}/docs/**/*.yaml`] //subcarpeta genérica
}

const specs =  swaggerJSDoc(swaggerOptions)
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//Server Socket
const io = new Server(serverExpress);

io.on('connection', (socket)=> {
    console.log('Socket io conectado')

    socket.on('add-message', async ({email, mensaje}) => {
        await messageModel.create({email: email, message: mensaje})
        const messages = await messageModel.find();
        socket.emit('show-messages', messages);
    })

    socket.on('messages-list', async() =>{
        const messages = await messageModel.find();
        socket.emit('show-messages', messages);
    })
});



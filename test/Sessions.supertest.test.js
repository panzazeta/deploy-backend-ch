import "dotenv/config";
import {expect} from "chai";
import mongoose from 'mongoose'
import supertest from 'supertest'

const requester = supertest('http://localhost:3000')

await mongoose.connect(process.env.MONGO_URL)
let cookie = {};

describe('Test Users Session api/sessions', function () {
    this.timeout(5000);

    it("Ruta: api/sessions/register con metodo POST", async () => {
        const newUser = {
            first_name: "Gogol",
            last_name: "Perezori",
            age: 26,
            email: "gogo@gmail.com",
            password: "sarassa"
        }

        const { statusCode, _body } = await requester
        .post("/api/sessions/register")
        .send(newUser);
  
      expect(statusCode).to.equal(201);
      expect(_body.mensaje).to.equal("Usuario registrado");
    });
       
    it("Ruta: api/sessions/login con metodo POST", async () => {
        const user = {
            email: "gogo@gmail.com",
            password: "sarassa"
        }

        const response = await requester.post('/api/sessions/login').send(user);

        expect(response.headers["set-cookie"]).to.be.an("array").that.is.not.empty;

        const cookieResult = response.headers["set-cookie"][0];
    
        const [cookieName, cookieValue] = cookieResult.split("=");
    
        cookie = {
          name: cookieName,
          value: cookieValue,
        };
    
        expect(cookieName).to.equal("connect.sid"); //qué onda connect.sid?
        expect(cookieValue).to.be.ok;
      });
   

    it("Ruta: api/sessions/current con método GET", async () => {
        
        const { _body } = await requester
        .get('/api/sessions/current')
        .set('Cookie', [`${cookie.name}=${cookie.value}`])
    
        expect(_body.email).to.be.equal('gogo@gmail.com');
    });

    after(async () => {
        await mongoose.disconnect();
      });

});
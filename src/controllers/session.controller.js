import { generateToken } from "../utils/jwt.js";
import { userModel } from "../models/users.models.js";

export const login = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ mensaje: "Usuario invalido" })
        }
        /*
        Si siguen con sesiones en BDD, esto no se bora. Si usan JWT, si
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
            res.status(200).send({mensaje: "Usuario logueado"})
        // }*/
        await userModel.findByIdAndUpdate(req.user._id, { last_connection: Date.now() });
        const token = generateToken(req.user)
        const updatedUser = await userModel.findById(req.user._id);

        const loginDate = new Date(updatedUser.last_connection).toLocaleString();
        
        res.status(200).send({
            token,
            last_connection: `${loginDate}`
        });

    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` })
    }

}

export const register = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: "Usuario ya existente" })
        }

        res.status(201).send({ mensaje: 'Usuario registrado' })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al registrar usuario ${error}` })
    }
}

export const logout = async (req, res) => {
    try {
        console.log(req.user);

        if (req.user) {
            // Actualiza last_connection al hacer logout
            await userModel.findByIdAndUpdate(req.user._id, { last_connection: Date.now() });

            const updatedUser = await userModel.findById(req.user._id);
            const logoutDate = new Date(updatedUser.last_connection).toLocaleString();

            res.clearCookie('jwtCookie');
            res.status(200).send({
                resultado: 'Usuario deslogueado',
                last_connection: `${logoutDate}`
            });
        } else {
            res.status(401).send({ resultado: 'Usuario no autenticado' });
        }
    } catch (error) {
        res.status(500).send({ mensaje: `Error al cerrar sesión ${error}` });
    }
};
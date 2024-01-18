import { userModel } from "../models/users.models.js";
import { sendRecoveryMail, sendDeletedAccount  } from "../config/nodemailer.js";
import crypto from "crypto";

const recoveryLinks = {}

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find().select('first_name email rol');
        res.status(200).send({ respuesta: 'OK', mensaje: users })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consultar usuarios', mensaje: error })
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user })
        } else {
            res.status(404).send({ respuesta: 'Error en consultar usuario', mensaje: 'User not Found' })
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consultar usuario', mensaje: error })
    }
}

export const putUser = async (req, res) => {
    const { id } = req.params
    const { first_name, last_name, age, email, password, premium } = req.body
    try {
        const user = await userModel.findByIdAndUpdate(id, { first_name, last_name, age, email, password, premium })
        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user })
        } else {
            res.status(404).send({ respuesta: 'Error en actualizar usuario', mensaje: 'User not Found' })
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en actualizar usuario', mensaje: error })
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findByIdAndDelete(id)
        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user })
        } else {
            res.status(404).send({ respuesta: 'Error en eliminar usuario', mensaje: 'User not Found' })
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en eliminar usuario', mensaje: error })
    }
}

export const deleteInactiveUsers = async (req, res) => {
    try {
        const currentTime = new Date();
        const thresholdMinutes = 2; // Tiempo en minutos para considerar inactivo

        const usersToDelete = await userModel.find({
            rol: 'user',
            last_connection: { $lt: new Date(currentTime - thresholdMinutes * 60000) },
        });

        if (usersToDelete.length > 0) {
            const deletionResult = await userModel.deleteMany({
                _id: { $in: usersToDelete.map(user => user._id) }
            });

            usersToDelete.forEach(async (user) => {
                await sendDeletedAccount(user.email);
            });

            res.status(200).send({
                respuesta: 'OK',
                mensaje: `${deletionResult.deletedCount} usuarios inactivos eliminados.`,
            });
        } else {
            res.status(200).send({
                respuesta: 'OK',
                mensaje: 'No hay usuarios inactivos para eliminar.',
            });
        }
    } catch (error) {
        res.status(500).send({ respuesta: 'Error al eliminar usuarios inactivos', mensaje: error });
    }
};

 //Enviar el mail
export const recoveryMail = async (req, res) => {
 const { email } = req.body

 try {
     const token = crypto.randomBytes(20).toString('hex') // Token unico con el fin de que no haya dos usuarios con el mismo link de recuperacion

     recoveryLinks[token] = { email: email, timestamp: Date.now() }

     const recoveryLink = `http://localhost:4000/api/users/reset-password/${token}`

     sendRecoveryMail(email, recoveryLink)

     res.status(200).send('Correo de recuperacion enviado')
 } catch (error) {
     res.status(500).send(`Error al enviar el mail ${error}`)
 }
}

export const resetPassword = async (req, res) => {
    const { token } = req.params
    const { newPassword, newPassword2 } = req.body
    try {
        const linkData = recoveryLinks[token]
        if (linkData && Date.now() - linkData.timestamp <= 3600000) {
            console.log(newPassword, newPassword2)
            const { email } = linkData
            console.log(email)
            console.log(token)
            if (newPassword == newPassword2) {
                //Modificar usuario con nueva contraseña

                delete recoveryLinks[token]

                res.status(200).send('Contraseña modificada correctamente')
            } else {
                res.status(400).send('Las contraseñas deben ser identicas')
            }
        } else {
            res.status(400).send('Token invalido o expirado. Pruebe nuevamente')
        }
    } catch (error) {
        res.status(500).send(`Error al modificar contraseña ${error}`)
    }
}

export const postDocuments = async (req, res) => {
    try{
        if(!req.file){
            return res.status(400).send({ message: 'Error al cargar archivo' });
        }
        return res.status(200).send({ message: 'Archivo cargado exitosamente' });
    } catch{
        return res.status(500).json({ message: 'Hubo un error al cargar los archivos' })
    }
}

export const postProfilePicture = async (req,res) => {
    try{
        if(!req.file){
            return res.status(400).send({ message: 'Error al cargar la imagen'})
        }

        return res.status(200).send({ message: 'Imagen cargada exitosamente'})

    }catch{

        return res.status(500).json({ message: 'Hubo un error al subir la imagen de perfil' });
    }
}

export const postProductsImage = async (req, res) => {
    try{
        if(!req.file){
            return res.status(400).send({ message: 'Error al cargar la imagen del producto' })
        }
        return res.status(200).send({ message: 'Imagen del producto cargada exitosamente' })

    }catch{
        return res.status(500).send({ message: 'Error al intentar subir imagen del producto' })
    }
}

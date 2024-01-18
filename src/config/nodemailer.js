import nodemailer from 'nodemailer'
import dotenv from "dotenv"

const password_email = process.env.PASSWORD_EMAIL

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'joealvarezsanabria23@gmail.com',
        pass: password_email,
        authMethod: 'LOGIN'
    }
})

export const sendRecoveryMail = (email, recoveryLink) => {
    const mailOptions = {
        from: 'joealvarezsanabria23@gmail.com',
        to: email,
        subject: 'Link para reestablecer su contraseña',
        text: `Haga click en el siguiente enlace para reestablecer su contraseña: ${recoveryLink}`
    }

    transport.sendMail(mailOptions, (error, info) => {
        if (error)
            console.log(error)
        else
            console.log('Email enviado correctamente')
    })
}

export const sendDeletedAccount = (email) => {
    const mailOptions = {
        from: 'joealvarezsanabria23@gmail.com',
        to: email,
        subject: 'Cuenta eliminada',
        text: `Se ha eliminado su cuenta por inactividad. AZO.`
    }

    transport.sendMail(mailOptions, (error, info) => {
        if (error)
            console.log(error)
        else
            console.log('Email enviado correctamente')
    })
}
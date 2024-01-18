const socket = io()

const botonChat = document.getElementById('botonChat')
const parrafosMensajes = document.getElementById('parrafosMensajes')
const valInput = document.getElementById('chatBox')
let email

Swal.fire({
    title: "Por favor, ingresá tu email",
    input: "text",
    inputValidator: (valor) => {
        return !valor && "Ingrese un nombre de usuario válido"
    },
    allowOutsideClick: false
}).then(resultado => {
    email = resultado.value
    socket.emit('messages-list')
})

botonChat.addEventListener('click', () => {
    if (valInput.value.trim().length > 0) {
        socket.emit('add-message', {email: email, mensaje: valInput.value })
                valInput.value = ""
    }
});

socket.on('show-messages', (allMessages) => {
    parrafosMensajes.innerHTML = ""
    allMessages.forEach(mensaje => {
        parrafosMensajes.innerHTML += `<p>${mensaje.fecha}: el usuario ${mensaje.email} escribió: ${mensaje.message} </p>`
    })
})
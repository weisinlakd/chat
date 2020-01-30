var socket = io();

var params = new URLSearchParams(window.location.search)



if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html'
    throw new Error ('El nombre y sala son necesarios')
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala'),
    foto: params.get('foto')
}

console.log(usuario);

socket.on('connect', function() {

    socket.emit('ingresarChat', usuario, function (resp){
        // console.log("usuarios en sala", resp)
        renderizarUsuarios(resp)
    })
    // console.log(usuario, 'Conectado al servidor');
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// socket.emit('crearMensaje', usuario, (resp) => {
//     console.log("usuarios en sala", resp);
// })


//mensajesPrivado

socket.on('mensajePrivado', (mensaje) => {

    console.log('mensaje Privado:',mensaje);

});

// Escuchar información
socket.on('enviarMensaje', (mensaje) => {

    console.log('Servidor:', mensaje);

});


socket.on('crearMensaje', (mensaje) => {

    // console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje , false);
    scrollBottom();

});


socket.on('listaPersona', (personas) => {

    renderizarUsuarios(personas)

});



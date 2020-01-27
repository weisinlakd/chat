const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios')
const { crearMensaje } = require('../utils/utils');
const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('ingresarChat', (data, callback)=>{

        console.log(data.sala)

        if (!data.nombre || !data.sala) {
            return callback({
                err: true,
                message: ' El nombre/sala es necesario'
            })
        }

        client.join(data.sala);


        usuarios.agregarPersona( client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        callback(usuarios.getPersonasPorSala(data.sala));
    })

    client.emit('enviarMensaje', {
        usuario: 'Administrador',
        mensaje: 'Bienvenido a esta aplicación'
    });



    client.on('disconnect', () => {

        let deletedUser = usuarios.borrarPersona(client.id);

        client.broadcast.to(deletedUser.sala).emit('crearMensaje', crearMensaje('Administrador', `${deletedUser.nombre} salió`))
        client.broadcast.to(deletedUser.sala).emit('listaPersona', usuarios.getPersonasPorSala(deletedUser.sala));

    });

    // Escuchar el cliente
    client.on('enviarMensaje', (data, callback) => {

        console.log(data);

        client.broadcast.emit('enviarMensaje', data);



    });

    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);



    });


    client.on('mensajePrivado', (data) => {

        console.log(data, 'mensajePrivado')
        let persona = usuarios.getPersona(client.id);
        
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(data.to).emit('mensajePrivado', mensaje);
    })

});
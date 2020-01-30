const crearMensaje = (nombre, mensaje, isAdmin, foto) => {
    if (isAdmin){

        return {
            nombre,
            mensaje,
            fecha: new Date().getTime(),
            isAdmin: true,
            foto
        }
    } else return {
        nombre,
        mensaje,
        fecha: new Date().getTime(),
        foto
    }
}

module.exports = {
    crearMensaje
}
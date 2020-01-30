var params = new URLSearchParams(window.location.search);

var divUsuarios = $('#divUsuarios');
var txtMensaje = $('#txtMensaje');
var formEnviar = $('#formEnviar');
var divChatbox = $('#divChatbox');
var chatTitulo = $('.chat-main-header');



var nombre = params.get('nombre');
var foto = params.get('foto')

renderizarUsuarios = (personas) => {

    console.log(personas)
    var html = '';

    html += '<li class="bg-white">';
    html += '<a href="javascript:void(0)" class="active bg-white"> Chat de <span>'+ params.get('sala') +'</span></a>'
    html += '</li>';

    personas.forEach(persona => {
        html += '<li class="bg-white">';
        html += '<a data-id="'+ persona.id +'"'+ 'href="javascript:void(0)"><img src="assets/images/users/'+ persona.foto +'" alt="user-img" class="img-circle"> <span> '+ persona.nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    });

    divUsuarios.html(html)

    html = '';

    html +=  '<div class="p-20 b-b bg-white">'
    html += '    <h3 class="box-title">Sala de chat <small>'+ params.get('sala') +'</small></h3>'
    html += '</div>'

    chatTitulo.html(html)
}


renderizarMensajes  = (mensaje , isMine) =>{


    var html = '';
    var fecha = new Date(mensaje.fecha);
    var amOpm = parseInt(fecha.getHours()) > 12 ? ' pm' : ' am';
    
    var hora = fecha.getHours() +  ' : ' + fecha.getMinutes()  +  amOpm;

    var isAdmin = 'info';
    if (mensaje.isAdmin){
        isAdmin = 'danger';
    }

    if (isMine){

        
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>'+ mensaje.nombre +'</h5>';
        html += '        <div class="box bg-light-inverse">'+ mensaje.mensaje +'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/'+ mensaje.foto+'" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li> ';
        
    } else {
        
        html += '<li class="animated fadeIn">'
        if (mensaje.nombre !== 'Administrador'){
            html +=     '<div class="chat-img"><img src="assets/images/users/'+ mensaje.foto +'" alt="user" /></div>';

        }
        html +=     '<div class="chat-content">'
        html +=     '<h5>'+ mensaje.nombre +'</h5>'
        
        html +=     '<div class="box bg-light-'+ isAdmin +'">'+ mensaje.mensaje +'</div>'
        html +=     '</div>'
        html +=     '<div class="chat-time">' + hora+ '</div>'
        html += '</li>';

    }
    

    divChatbox.append(html);
}

function scrollBottom() {

    
    var newMessage = divChatbox.children('li:last-child');

 
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


renderTitulo = () => {

    
}

//listeners 

divUsuarios.on('click', 'a', function() {

    var id = $(this).data('id');

    

    if (id) {

        console.log(id);
        
    }
})

formEnviar.on('submit', function(e) {


    e.preventDefault();

    if (txtMensaje.val().trim().length === 0){
        return;
    };
    
    
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }
    , (mensaje) => {
        txtMensaje.val('').focus;
        renderizarMensajes(mensaje, true);
        scrollBottom();
    })
})


 var htmlMensaje;
 
 function mostrarDialog() {
   var dialog = document.getElementById('my-dialog');
 
   if (dialog) {
     dialog.show();
   } else {
     ons.createElement('dialog.html', { append: true })
       .then(function(dialog) {
         dialog.show();
         var sel = $("#mensajeUsuario");


         $.ajax({
            url:"http://marcelocaiafa.com/usuario.php",
            type:"GET",
            dataType:"json",
            success:function(respuesta){

               $.each(respuesta.descripcion, function(key,value){
                  var option = $("<option />").val(value.id).text(value.nombre+ " " + value.apellido);
                  sel.append(option);
               
                // $("#mensajeUsuario").append("<option value='"+value.id +"'>" + value.nombre + " " + value.apellido +"</option>")

               });
            },
            error:function(xml, err, status){
                  // si hay error muestro error del servidor en toast.
                  console.log(xml);
                  //ons.notification.toast(xml.responseJSON.descripcion, {"timeout":3000}); 
               },
            complete:function(){
               $("#modal_cargando").hide();
            }   
            })
       });
   }
 };
 
 function ocultarDialog(id) {
   document
     .getElementById(id)
     .hide();
 };

window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

//window.fn.load = function(page) {
//  var content = document.getElementById('content');
//  var menu = document.getElementById('menu');
//  content.load(page).then(menu.close.bind(menu));
//};

window.fn.load = function(page, params) {
  //var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  //content.load(page).then(menu.close.bind(menu));
  var p = page.replace("t_","p_");
  var nav = document.getElementById('nav');
  menu.close();
  for (let index = 0; index < nav.pages.length; index++) {
     if(nav.pages[index]["id"] == p){
        nav.replacePage(page,params);
        return;
     }
  }
  nav.pushPage(page, params);
}

ons.ready(function(){

   $("#btn_registrar_usu").on("click", function(){
        var usuario = $("#inp_usuario").val();
        var password = $("#inp_pwd").val();
        //envio datos al servidor
        datos = {
         usuario:usuario,
         password:password
        };
        $.ajax({
           url:"http://oransh.develotion.com/usuarios.php",
           data:JSON.stringify(datos),
           type:"POST",
           dataType:"json",
           success:function(respuesta){
               //si todo ok redirecciono a listado de usuarios.
               $.ajaxSetup({
                  headers:{
                     token:respuesta.token
                  }
               });
               fn.load('t_listado_usuarios');
           },
           error:function(xml, err, status){
               // si hay error muestro error del servidor en toast.
               //console.log(xml.responseJSON.descripcion);
               ons.notification.toast(xml.responseJSON.descripcion, {"timeout":3000}); 
            }
         });
   });

   $("#btn_registrar").on("click", function(){
      var myNavigator = document.getElementById('nav');
      fn.load('t_registro');
   });

   $("#btn_login").on("click", function(){
      var usuario = $("#inp_login_usuario").val();
      var password = $("#inp_login_pwd").val();
      //envio datos al servidor
      datos = {
       usuario:usuario,
       password:password
      };      
      $.ajax({
      url:"http://oransh.develotion.com/login.php",
      data:JSON.stringify(datos),
      type:"POST",
      dataType:"json",
      success:function(respuesta){
            //si todo ok redirecciono a listado de usuarios.
            //redirecciono a listado de usuario
            $.ajaxSetup({
               headers:{
                  token:respuesta.token
               }
            });
            console.log(respuesta.token);
            //grabo el objeto como string en session.
            sessionStorage.setItem("usuario", JSON.stringify(respuesta.descripcion));
            var myNavigator = document.getElementById('nav');
            myNavigator.pushPage('t_listado_usuarios');
      },
      error:function(xml, err, status){
            // si hay error muestro error del servidor en toast.
            //console.log(xml.responseJSON.descripcion);
            ons.notification.toast(xml.responseJSON.descripcion, {"timeout":3000}); 
         }
      });
   });
});



function enviarMensaje() {
   var receptor = $("#mensajeUsuario option:selected").val();
   var mEnsaje = $("#mensajeHtml").val();
   var usuario = sessionStorage.getItem("usuario");
   //vuelvo a convertir a objeto
   usuario = JSON.parse(usuario);
   var yo = usuario.id;
   console.log(receptor + "  " + mEnsaje + " " + yo);
   datos = {
      "de": yo,
      "para": receptor,
      "mensaje": mEnsaje
   };
   $.ajax({
      url: "http://marcelocaiafa.com/mensaje.php",
      data: JSON.stringify(datos),
      type: "POST",
      dataType: "json",
      success: function (respuesta) {
         console.log("success");
         ocultarDialog("my-dialog");
      },
      error: function (xml, err, status) {
         // si hay error muestro error del servidor en toast.
         //console.log(xml.responseJSON.descripcion);
         ons.notification.toast(xml.responseJSON.descripcion, { "timeout": 3000 });
      }
   });


}

function mensajes_usuarios(id){
   datos = {
      usuario:id
   }
   $.ajax({
      url:"http://marcelocaiafa.com/mensaje.php?usuario="+id ,
      type:"GET",
      dataType:"json",
      success:function(respuesta){
         if(!respuesta.descripcion){
            $('#lista_mensajes').append("<p>No tenes amigos!</p>");
         }else{
            respuesta.descripcion.forEach(element => {
               var img = "http://images.marcelocaiafa.com/"+element.de+".png"
               $('#lista_mensajes').append("<article style='margin:10px 10px 10px 10px'>"+
                                                "<ons-row>"+
                                                   "<ons-col width='50px'><img class='list-item__thumbnail' src='"+img+"'></ons-col>"+
                                                   "<ons-col>"+element.nombre+" "+element.apellido+"</ons-col>"+
                                                "</ons-row>"+
                                                   "<ons-col>"+element.email+"</ons-col>"+
                                                "<ons-row>"+
                                                   "<ons-col>"+element.fecha+"</ons-col>"+
                                                "</ons-row>"+
                                                "<ons-row>"+
                                                   "<ons-col>"+element.mensaje+"</ons-col>"+
                                                "</ons-row>"+
                                             "</article>");
            });
         }
      },
      error:function(xml, err, status){
         $('#lista_mensajes').append("<p>No tenes amigos ... marginado!</p>");
       }
    });
}
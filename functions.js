function cargarUsuario(id){
   R_usuario = sessionStorage.getItem("usuario")
   usuario = JSON.parse(R_usuario)
   $(".card__content").append("<h1 class='card__title'>"+usuario.nombre+"</h1>"+
                              "<p>Esto es un ejemplo de que le usuario: "+usuario.nombre+" es un gil.</p>"+
                              "<p>El ID : "+id+"</p>");
   $(".card__image").attr("src","http://images.marcelocaiafa.com/"+usuario.id+".png")

}

function listado_usuarios(){
   $.ajax({
      url:"http://marcelocaiafa.com/usuario.php",
      type:"GET",
      dataType:"json",
      success:function(respuesta){
            //console.log(respuesta)
            respuesta.descripcion.forEach(element => {
               $("#lista").append(" <ons-list-item id='"+element.id+"' class='fila-clic' data-user='"+element.id+"' tappable modifier='chevron'>"+
                                  "    <div class='left'>"+
                                  "       <img class='list-item__thumbnail' src='http://images.marcelocaiafa.com/"+element.id+".png'>"+
                                  "    </div>"+
                                  "    <div class='center'>"+
                                  "       <span class='list-item__title'>"+element.nombre+" "+element.apellido+"</span>"+
                                  "       <span class='list-item__subtitle'>"+element.email+"</span>"+
                                  "    </div>"+
                                  " </ons-list-item>");
            });
            //document.querySelector("ons-list-item").addEventListener('tap',function(){
            //   alert("hola")
            //   console.log($(this).data('user'))
            //});
            $(".fila-clic").on('click',function(){
               console.log($(this).data('user'))
               var myNavigator = document.getElementById('nav');
               myNavigator.pushPage('t_usuario', {data: { usu: $(this).data('user') },});
            });
      },
      error:function(xml, err, status){
            // si hay error muestro error del servidor en toast.
            console.log(xml);
            //ons.notification.toast(xml.responseJSON.descripcion, {"timeout":3000}); 
         }
      });
}

ons.ready(function(){

   $("#btn_registrar").on("click", function(){
        var usuario = $("#inp_usuario").val();
        var password = $("#inp_pwd").val();
        var email = $("#inp_email").val();
        var telefono = $("#inp_tel").val();
        var direccion = $("#inp_dir").val();
        var nombre = $("#inp_nom").val();
        var apellido = $("#inp_ape").val();
        var genero      = $("#sel_genero").val();
        //envio datos al servidor
        datos = {
         usuario:usuario,
         password:password,
         email:email,
         telefono:telefono,
         direccion:direccion,
         nombre:nombre,
         apellido:apellido,
         genero:genero
        };
        $.ajax({
           url:"http://marcelocaiafa.com/usuario.php",
           data:JSON.stringify(datos),
           type:"POST",
           dataType:"json",
           success:function(respuesta){
               //si todo ok redirecciono a listado de usuarios.
               console.log(respuesta)
               ons.notification.toast("Se registro usuario correctamente", {"timeout":3000});
           },
           error:function(xml, err, status){
               // si hay error muestro error del servidor en toast.
               //console.log(xml.responseJSON.descripcion);
               ons.notification.toast(xml.responseJSON.descripcion, {"timeout":3000}); 
            }
         });
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
      url:"http://marcelocaiafa.com/login.php",
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
            console.log(respuesta);
            sessionStorage.setItem("usuario", JSON.stringify(respuesta.descripcion))
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
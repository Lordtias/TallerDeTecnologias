 var htmlMensaje;
 var mymap={};
 var usuandoMonopatin = false;
 var token = null;
 var costo_segundo = 2;
 var costo_inicio = 46;
 var markerGroup;
 var flag;

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

window.fn.open = function() {
   var menu = document.getElementById('menu');
   menu.open();
 };

window.fn.load = function(page, params) {
  var menu = document.getElementById('menu');
  var p = page.replace("t_","p_");
  var nav = document.getElementById('nav');
  menu.close();
  for (let index = 0; index < nav.pages.length; index++) {
     if(nav.pages[index]["id"] == p){
        nav.bringPageTop(page,params);
        return;
     }
  }
  nav.pushPage(page, params);
}

ons.ready(function(){
   // $("#tarjeta").on("click", function(){
   //    var usu = sessionStorage.getItem("usuario");
   //    var id = sessionStorage.getItem("usuario_id");

   //    datos = {
   //     usuario:id,
   //    };
   //    console.log("holaaaa");
   //    fn.load('t_billetera', {data:{"usu":usuario, "id":respuesta.id}});

   //    $.ajax({
   //    url:"http://oransh.develotion.com/login.php",
   //    data:datos,
   //    type:"POST",
   //    dataType:"json",
   //    success:function(respuesta){
   //         console.log(respuesta);
   //         //sessionStorage.setItem("usuario", JSON.stringify(respuesta.descripcion));
   //         fn.load('t_billetera', {data:{"usu":usuario, "id":respuesta.id}});
   //    },
   //    error:function(xml, err, status){
   //         ons.notification.toast(xml.responseJSON.descripcion, {"timeout":3000}); 
   //      }
   //    });
   // });
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
function cargarMonopatines(latitud, longitud, mymap){
   $("#spn_cargando").text("Buscando monopatines mas cercanos ...");
   $("#modal_cargando").show();

   var Aharv = [];
   var Aelement = [];

   markerGroup.clearLayers();

   var scooterIcon = L.icon({
      iconUrl: 'scooter_icon.png',
      iconSize: [32, 32],
      iconAnchor: [32, 32],
      popupAnchor: [-3, -76]
   });

   var scooterBatteryIcon = L.icon({
      iconUrl: 'scooter_b_icon.png',
      iconSize: [32, 32],
      iconAnchor: [32, 32],
      popupAnchor: [-3, -76]
   });

   $.ajax({
      url:"http://oransh.develotion.com/monopatines.php",
      type:"GET",
      dataType:"json",
      success:function(response){
         var i =0;
         response.monopatines.forEach(element => {
            //var marker = L.marker([element.latitud, element.longitud]).addTo(mymap);
            Aharv[i] = haversine(latitud,longitud,element);
            Aelement[i] = element;
            i++;

         });
         bubbleSort(Aharv,Aelement)
         
         markerGroup.clearLayers();

         for (let index = 0; index < 5; index++) {
            const ele = Aelement[index];
            if(Aelement[index].bateria >40){
               var marker = L.marker([ele.latitud, ele.longitud], {icon: scooterIcon}).addTo(markerGroup)
               .on('click', function(e){
                  //markerGroup.removeLayer(e.target._leaflet_id)
                  fn.load('t_scooter', {data:{"mono":Aelement[index]}});
               })
            }
            else{
               var marker = L.marker([ele.latitud, ele.longitud], {icon: scooterBatteryIcon}).addTo(markerGroup)
               .on('click', function(e){
                  //markerGroup.removeLayer(e.target._leaflet_id)
                  fn.load('t_scooter', {data:{"mono":Aelement[index]}});
               })
            }
         }
         
         markerGroup.addTo(mymap);
      },
      error:function(xml, err, status){
         console.log(err);
      },
      complete:function(){
         $("#modal_cargando").hide();  
      }
   });
}

function toRadians(x){
   return Math.sin(x * Math.PI / 180)
}

function haversine(latitud, longitud,element){
   var R = 6371e3; // metres
   var lat1 = toRadians(latitud);
   var lat2 = toRadians(element.latitud);
   var delta1 = toRadians((element.latitud-latitud));
   var delta2 = toRadians((element.longitud-longitud));

   var a = Math.sin(delta1/2) * Math.sin(delta1/2) +
         Math.cos(lat1) * Math.cos(lat2) *
         Math.sin(delta2/2) * Math.sin(delta2/2);
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

   return R * c;
}

function bubbleSort(Aharv, Aelement) 
{ 
    var n = Aharv.length; 
  
    for(var i = 0; i < n; i++)  
    { 
        for (var j = 0; j < n - i - 1; j++)  
        { 
            if (Aharv[j] > Aharv[j+1]) 
            { 
                var t = Aharv[j];
               var m = Aelement[j];

                Aharv[j] = Aharv[j+1];
                Aelement[j] = Aelement[j+1];

                Aharv[j+1] = t;
                Aelement[j+1] = m;

            } 
        } 
    }
}

function getTime(stage){
   var fecha = new Date();
   if(stage == 'Inicio'){
      sessionStorage.setItem("f_Ini",fecha.getTime());
   }
   if(stage == 'Fin'){
      sessionStorage.setItem("f_Fin",fecha.getTime());
   }
   return   "<strong>Fecha: </strong>"+fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear()+
            " - <strong>Hora: </strong>"+addZero(fecha.getHours())+":"+addZero(fecha.getMinutes())+":"+addZero(fecha.getSeconds())
}

function addZero(i) {
   if (i < 10) {
     i = "0" + i;
   }
   return i;
 }

function getDuracion(){
   var f_Ini = sessionStorage.getItem("f_Ini");
   var f_Fin = sessionStorage.getItem("f_Fin");
   
   const diffTime = Math.abs(f_Fin - f_Ini);
   const diffSegundos = Math.ceil(diffTime / (1000));
   
   return diffSegundos
}

function getCosto(segundos){
   return (segundos * costo_segundo) + costo_inicio; 
}

function validarSaldo(id){
   var button = document.getElementById("btn_alquilar");
   button.innerHTML = "<ons-icon size='30px' spin icon='md-spinner'></ons-icon> Alquilar monopatin";
   var saldito;
   var ret = false;
   $.ajax({
      url: "http://oransh.develotion.com/tarjetas.php",
      type: "GET",
      dataType: "json",
      async: false,
      data: { id: id },
      success: function (respuesta) {
         saldito = respuesta.saldo;
         if(respuesta.saldo < 49)  {
            ret= false;
         }else{
            ret= true;
         }
         button.innerHTML = "Alquilar monopatin";
      }
   });
   return ret;
}

function actualizarSaldo(saldo){
   saldo = "-"+saldo;
   $.ajax({
      url: "http://oransh.develotion.com/tarjetas.php",
      type: "PUT",
      data: { id: id, saldo: saldo },
      dataType: "json",
      success: function (respuesta) {
          ons.notification
          .alert("El alquiler fue debitado de su tarjeta!",{title:"EXITO!"})
      },
      complete: function () {
      }
  });
}

function noEstaLogeado(){
   var usuario     = sessionStorage.getItem("usuario_nombre");
   //var usu       = JSON.parse(usuario);
   //var id        = usu.id;
   var id          = sessionStorage.getItem("usuario_id");
   console.log(usuario +" "+ id)
   if( ! id || ! usuario ) return true;
   else return false;
}

function cerrarSesion(){
   sessionStorage.clear()
   var nav = document.getElementById('nav');
   var menu = document.getElementById('menu');
   menu.close();
   nav.resetToPage('t_login');
   // fn.load('t_login')
}

function noEsNumero(saldo){
   if(!saldo) return true;
   else{
      if(isNaN(saldo)) return true;
      else return false;
   }   
}
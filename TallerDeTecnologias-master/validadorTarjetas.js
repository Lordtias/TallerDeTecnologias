var validadores = []

//Visa
var visa_validador      = "4(?:[0-9]{12}|[0-9]{15})"
validadores = [{nombre:"Visa", validador: visa_validador, img:"Visa.jpg"}]

//Mastercard
var master_validador    = "5[1-5][0-9]{14}"
validadores = validadores.concat([{nombre:"Master", validador: master_validador, img:"Master.jpg"}])

function validarTarjetaDeCredito(numero){
     var Card=null;
     var value = String(numero).replace(/[- ]/g,'');
     validadores.forEach(tarjeta => {
         if(value.match(tarjeta.validador)){
           Card = tarjeta;
        }
    });
    return Card
 }
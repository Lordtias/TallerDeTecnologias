var tamanio     = 1024*1024*5

//Creo conexion de Base de datos.
var db          = window.openDatabase("Quelopatin", "", "Historico de viajes realizados.", tamanio, function(){
    //Se ejecuta solo cuando creo la Base de Datos.
    db.transaction(function(tx){
        tx.executeSql("CREATE TABLE if not EXISTS historico (id integer(10), nombre varchar(100), f_ini varchar(100), f_fin varchar(100), duracion integer(20), costo integer(20))");
    }),
    //Si hay error recibo una exception.
    function(e){
        console.log(e.message)
    },
    //Si transaccion OK.
    function(){
        console.log("Transaccion correcta!")
    }
});

function addToHistorico(id,nombre,f_ini,f_fin,duracion,costo){
    db.transaction(function(tx){
        tx.executeSql("INSERT or IGNORE INTO historico values("+id+",'"+nombre+"','"+f_ini+"','"+f_fin+"',"+duracion+","+costo+");")
    },
    function(e){
        console.log(e.message)
    }
    );
}
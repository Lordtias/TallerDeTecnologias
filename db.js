var tamanio     = 1024*1024*5

//Creo conexion de Base de datos.
var db          = window.openDatabase("Favoritos", "", "Descripcion de la DB", tamanio, function(){
                        //Se ejecuta solo cuando creo la Base de Datos.
                        db.transaction(function(tx){
                            tx.executeSql("CREATE TABLE if not EXISTS usuarios (id integer(10), nombre varchar(100))");
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

if(db.version == ""){
    console.log("Estoy en la version inicial");
    db.changeVersion("","1.0", function(tx){
        tx.executeSql("ALTER TABLE usuarios ADD COLUMN apellido varchar(100);")
    });
}
else if(db.version == "1.0"){
    console.log("Estoy en la version 1.0")
}

function addFavorito(id,nombre,apellido){
    db.transaction(function(tx){
        console.log("Hago el insert!")
        tx.executeSql("INSERT or IGNORE INTO usuarios values('"+id+"','"+nombre+"','"+apellido+"');")
    },
    function(e){
        console.log(e.message)
    }
    );
}
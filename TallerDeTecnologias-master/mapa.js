$(document).ready(function(){
    // toastr.options = {
    //     "closeButton": true,
    //     "progressBar": true,
    //     "positionClass": "toast-bottom-right",
    //     }
    try{
        var latitud  = $("#lat").val();
        var longitud = $("#lon").val();
        
        var mymap = L.map('mapid').setView([latitud, longitud], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: '',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibG9yZHRpYXMiLCJhIjoiY2p5aHk4dzgxMDRxdjNuanhkZHlydXhqbSJ9.4lLFkbGTNbtNUbXca3FP-w'
        }).addTo(mymap);
        var marker = L.marker([latitud, longitud]).addTo(mymap);
        var circle = L.circle([latitud, longitud], {
                                                    color: 'red',
                                                    fillColor: '#f03',
                                                    fillOpacity: 0.5,
                                                    radius: 500
                                                }).addTo(mymap);
        var polygon = L.polygon([
                                    [-34.911111, -56.164532],
                                    [-34.901111, -56.154532],
                                    [-34.901111, -56.154532]
                                ]).addTo(mymap);
    }
    catch(e){
        console.log(e.message);
    }
});
// Loading the map into the div id=map     

var map;
// Center the map
var mooseJaw = {lat: 50.3970, lng: -105.5349};
// Creating the map
function initMap() {

   map = new google.maps.Map(document.getElementById('map'), {
     center: mooseJaw,
     zoom: 13
   });   

   var script = document.createElement('script');
   script.src = 'mymarkers.js';
   document.getElementsByTagName('head')[0].appendChild(script);
   
   var trafficLayer = new google.maps.TrafficLayer();
   trafficLayer.setMap(map);

}

window.eqfeed_callback = function(results) {
   var holder = "";
   for (var i = 0; i < results.features.length; i++) {
     var coords = results.features[i].geometry.coordinates;
     var name = results.features[i].properties.name;
     var loc = results.features[i].properties.location;
     var desc = results.features[i].properties.status;
     var latLng = new google.maps.LatLng(coords[0],coords[1]);
     var marker = new google.maps.Marker({
       position: latLng,
       map: map
     });
    holder = holder +
       "<tr><td>" + name + "</td><td>" + loc + "</td><td>" + desc + "</td></tr>";
   }
   document.getElementById("jsonprint").innerHTML =  
           "<table><tr><th>Issue</th><th>Location</th><th>Status</th></tr>" +
           holder +"</table>";
 };//endCallback



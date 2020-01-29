var longitude, latitude;
var markers = [];

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

console.log('Markers')
console.log(markers)

if(isEmpty(markers)) {
    markers=[{lat: 40.417, long:-3.702, img: null}]
}

console.log(markers[markers.length-1].long)
console.log(markers[markers.length-1].lat)

mapboxgl.accessToken = "pk.eyJ1IjoiYWxlamFuZHJvZHMiLCJhIjoiY2s1MDUxb29mMGd6MjNsc2FvOWN3cGc3cCJ9.VYpz5MMK9RUimFuG0TOeOw"
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v10',
    center: [markers[markers.length-1].long, markers[markers.length-1].lat],
    zoom: 10,
    bearing: -17.6,
    maxZoom: 25,
    minZoom: 3,
    pitch:45
});

map.addControl(new mapboxgl.FullscreenControl());
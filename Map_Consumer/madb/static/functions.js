
/*
// The 'building' layer in the mapbox-streets vector source contains building-height
// data from OpenStreetMap.
map.on('load', function() {
    // Insert the layer beneath any symbol layer.
    var layers = map.getStyle().layers;
    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

map.addControl(new mapboxgl.FullscreenControl());

// Navigation marker at top-left corner
var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');
// change false to true, to get your location. Then, enable location in the browser.
map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: false
        },
    trackUserLocation: false
}));


map.addLayer({
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
        'fill-extrusion-color': '#aaa',
        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
            "interpolate", ["linear"], ["zoom"],
            15, 0,
            15.05, ["get", "height"]
        ],
        'fill-extrusion-base': [
            "interpolate", ["linear"], ["zoom"],
            15, 0,
            15.05, ["get", "min_height"]
        ],
        'fill-extrusion-opacity': .6
    }
}, labelLayerId);
});

var currentMarkers = []

// Function to add markers
function add_markers(markers) {
    console.log("Inside Funct")
    console.log(markers)

//    $( ".marker" ).remove();

    // Loop to show n markers at the same time
    // Add popup with user and tweet
    for (var i = 0; i< markers.length; i++){
        console.log(markers[i])

        var el = document.createElement('div');
        el.className = 'marker';
        if (markers[i].img) {
            el.style.backgroundImage = 'url('+markers[i].img+')';
        }
        el.style.width = '50px';
        el.style.height = '50px';

        console.log(el.style.backgroundImage)

        // Create popup
        var popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML('<b>Username: </b>' + markers[i].user + '<b><br>Tweet: </b>' + markers[i].twt);

        // Create marker, add coordinates and popup.
        var marker_map = new mapboxgl.Marker(el)
            .setLngLat([markers[i].long, markers[i].lat])
            .setPopup(popup)
            .addTo(map);

        currentMarkers.push(marker_map);

        console.log('--------TA')
        for (var i = marker_map_list.length - 1; i >= 0; i--) {
            console.log(currentMarkers[i].getLatLng())
//            marker_map[i].remove();
        }
    }
}


var source = new EventSource('/topic/streaming.twitter.coord');
source.addEventListener('message', function(e){
    console.log('Message');
    obj = JSON.parse(e.data);
    console.log(obj);

    latitude = obj.place.bounding_box.coordinates[0][0][1];
    longitude = obj.place.bounding_box.coordinates[0][0][0];
    username = obj.user.name;
    tweet = obj.text;
    img_profile = obj.user.profile_image_url;

    n_markers = 7
    markers.push({lat: latitude, long: longitude, user: username, twt: tweet, img: img_profile})
    markers_slice = markers.slice(markers.length-n_markers)

    console.log('---------------')
    add_markers(markers_slice);
}, false);
/*
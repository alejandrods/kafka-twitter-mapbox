// Define main-map
mapboxgl.accessToken = "pk.eyJ1IjoiYWxlamFuZHJvZHMiLCJhIjoiY2s1MDUxb29mMGd6MjNsc2FvOWN3cGc3cCJ9.VYpz5MMK9RUimFuG0TOeOw"
var main_map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-3.702, 40.417],
    zoom: 10,
    bearing: -17.6,
    maxZoom: 25,
    minZoom: 2,
    pitch:45
});

// Define box-map
var box_map = new mapboxgl.Map({
    container: 'viewshed',
    center: [-3.702, 40.417],
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: -0.80,
    zoomControl:false,
    interactive: false
});

// Add fullscreen button
main_map.addControl(new mapboxgl.FullscreenControl());
// Add Navigation Control
main_map.addControl(new mapboxgl.NavigationControl());

// Event Listener to get value from flask-app
var source = new EventSource('/topic/streaming.twitter.coord');
source.addEventListener('message', function(e){
    marker2map = JSON.parse(e.data);
    console.log('--------NEW MESSAGE -MB--------')
    console.log(marker2map);

    display_mk_main_map(marker2map);
    display_mk_box_map(marker2map);
}, false);

// Function to display marker - boxmap
var currentMarkers_mb = [];

function display_mk_box_map(marker) {
    // Create html element to plot marker
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(../static/Twitter_Logo.svg)';
    el.style.width = '14px';
    el.style.height = '14px';

    var marker_map_mb = new mapboxgl.Marker(el)
            .setLngLat([marker.long, marker.lat])
            .addTo(box_map);

    // Append market into array
    currentMarkers_mb.push(marker_map_mb);

    // We show 7 markers at the same time. This function deletes markers in order
    n_markers = 7
    if (currentMarkers_mb.length==n_markers){
        currentMarkers_mb[0].remove();
        currentMarkers_mb = currentMarkers_mb.slice(currentMarkers_mb.length-(n_markers-1))
    }
    console.log('--------END MESSAGE -MB--------')
}

// Function to plot progress bar
function display_progress(content, color){
    var progress_bar = new ProgressBar.Circle(content, {
        color: '#bcb',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 7,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1200,
        text: {
            autoStyleContainer: true
        },
        from: { color: '#aaa', width: 3},
        to: { color: color, width: 7},
        // Set default step function for all animate calls
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            var value = Math.round(circle.value() * 100);
            if (value === 0) {
                circle.setText('');
            } else {
                circle.setText(value);
            }
    }});
    return progress_bar
}

var opened = false;
var currentMarkers = [];
function display_mk_main_map(marker) {

        // Create html element to plot marker
        var el = document.createElement('div');
        el.className = 'marker';

        if (marker.img) {
            el.style.backgroundImage = 'url('+marker.img+')';
        }
        el.style.width = '50px';
        el.style.height = '50px';

        console.log("currentMarkers_mb")
        console.log(currentMarkers_mb);

        // Create popup
        var popup = new mapboxgl.Popup({ offset: 25 })
        popup['opened'] = false
        popup.setHTML('<div class="outer"><div class="box-text"><b>Username: </b>' + marker.user + '<b><br>Tweet: </b>' + marker.twt + '</div><div class="pop_graph_up" id="pop_graph_up"></div><div class="pop_graph_down" id="pop_graph_down"></div></div>');

        // Create marker, add coordinates and popup.
        var marker_map = new mapboxgl.Marker(el)
            .setLngLat([marker.long, marker.lat])
            .setPopup(popup)
            .addTo(main_map);

        marker_map["OPENED"] = false
        // Append market into array
        currentMarkers.push(marker_map);

        // We show 7 markers at the same time. This function deletes markers in order
        n_markers = 12
        if (currentMarkers.length==n_markers){
            currentMarkers[0].remove();
            currentMarkers = currentMarkers.slice(currentMarkers.length-(n_markers-1))

        }
        // Change with the results from the model
        var total_goals = 10;
        var goals_completed = marker.pred;

        popup.on('open', function(e) {
            console.log("POPUP OPEN")

            console.log("1")
            var obj_popup = marker_map.getPopup()
            console.log(obj_popup)

            if (obj_popup.opened==false){
                bar_up = display_progress(content=pop_graph_up, color='#CFCF25')
                bar_down = display_progress(content=pop_graph_down, color='#CF9125')

                bar_up.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
                bar_up.text.style.fontSize = '0.5rem';
                bar_up.animate(goals_completed/total_goals);

                bar_down.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
                bar_down.text.style.fontSize = '0.5rem';
                bar_down.animate(goals_completed/total_goals);
            }

            var obj_opened_popup = marker_map.getPopup()
            console.log('update value')
            console.log(obj_opened_popup)
            obj_opened_popup['opened'] = true
        });

        console.log('--------END MESSAGE--------')
}

// FlyTo click
box_map.on('click', function(e) {
    console.log(e.lngLat.wrap())
    main_map.flyTo({
        center: [
            e.lngLat.wrap().lng,
            e.lngLat.wrap().lat
        ],
        zoom:6,
        essential: true
    });
});
var config = getConfig();

function getConfig() {
  // if you pass ?dev=true to your url address default config that will be used is `config-development`
  // otherwise - `config-production`
  var configName = getParameterByName('dev', false) ? 'env' : 'env';

  window._config || (window._config = {});

  // for production version you should concat your config with main script or put it above main script
  // inside global `_config` variable for example
  if (window._config[configName]) return window._config[configName];

  // for development version you can just make an ajax call to get the config
  $.ajax({
    url : 'static/resources/conf/' + configName + '.json',
    async : false,
    success : function(response) {
      window._config[configName] = response;
    }
  });
  return window._config[configName];
}

function getParameterByName(name, defaults, location) {
  location = location || window.location.href;
  name = name.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]');
  var result = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(location);
  return result === null ? defaults : decodeURIComponent(result[1].replace(/\+/g, ' '));
}

if (screen.width < 1280 || screen.height < 740) {
    document.location = "mobile.html";
}

// Load Loading Animation
var lottieAnimation = bodymovin.loadAnimation({
  container: document.getElementById('anim'),
  path: '../static/resources/Twitter_Anim.json',
  renderer: 'svg',
  loop: true,
  autoplay: true,
})

// TimeOut to loading page
setTimeout(function() {
    $('#loading').fadeOut('fast');
    $('.footer').fadeOut('fast');
}, 4000);

// Load animation
var lottieAnimation = bodymovin.loadAnimation({
  container: document.getElementById('boxbar_anim'),
  path: '../static/resources/Twitter_Anim.json',
  renderer: 'svg',
  loop: true,
  autoplay: true,
})

// Main Map Init
mapboxgl.accessToken = config.MAPBOX_TOKEN
var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });

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

// Get coordinate query
var coordinatesGeocoder = function(query) {
    // match anything which looks like a decimal degrees coordinate pair
    var matches = query.match(
        /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
        );
    if (!matches) {
        return null;
    }
    function coordinateFeature(lng, lat) {
        return {
            center: [lng, lat],
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            place_name: 'Lat: ' + lat + ' Lng: ' + lng,
            place_type: ['coordinate'],
            properties: {},
            type: 'Feature'
        };
    }

    var coord1 = Number(matches[1]);
    var coord2 = Number(matches[2]);
    var geocodes = [];

    if (coord1 < -90 || coord1 > 90) {
        // must be lng, lat
        geocodes.push(coordinateFeature(coord1, coord2));
    }

    if (coord2 < -90 || coord2 > 90) {
        // must be lat, lng
        geocodes.push(coordinateFeature(coord2, coord1));
    }

    if (geocodes.length === 0) {
        // else could be either lng, lat or lat, lng
        geocodes.push(coordinateFeature(coord1, coord2));
        geocodes.push(coordinateFeature(coord2, coord1));
    }

    return geocodes;
};

// Add search-bar
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    localGeocoder: coordinatesGeocoder,
    mapboxgl: mapboxgl,
    marker: false
});

document.getElementById('geocoder').appendChild(geocoder.onAdd(main_map));

// Function to add and update graph-bar
var options = {
      series: [{
        data: []
      }],
      chart: {
        id: 'chart1',
        type: 'bar',
        height: 260,
        width: 280,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      dataLabels: {
        position: false
      },
      colors: [
        "#F3B415",
        ],
      axisBorder: {
        show: false
      },
      xaxis: {
        categories: [],
        show: false,
        labels: {
            show: false
        }
      },
      yaxis: {
        show: false
      },
      tooltip: {
        enabled: false
      }
    };


var chart = new ApexCharts(document.querySelector("#viewshed_graph"), options);
chart.render();

function changeData(options) {
    ApexCharts.exec('chart1', "updateOptions", {
        xaxis: {
          categories: options.xaxis.categories
        }
      });

    ApexCharts.exec('chart1', "updateSeries", [
        {
        data: options.series[0].data
        }
    ]);

    ApexCharts.exec('chart1', "updateOptions", {
        yaxis: {
          show: true
        }
      });
}

// Function to get place in based on coordinates and update bar_graph
country2idx = {}

i = 0;
function coord2place(lng_coord, lat_coord, callback) {
    mapboxClient.geocoding
    .reverseGeocode({
        query: [lng_coord, lat_coord],
    })
    .send()
    .then(function(response) {
        if (
            response &&
            response.body &&
            response.body.features &&
            response.body.features.length
        ) {
            features = response.body.features

            for (i = 0; i < features.length; i++) {
                if (features[i].id.includes('country')) {
                    country = features[i].text
                    break
                }
            }

            categ_options = options.xaxis.categories

            // Check if country in dict
            if (country2idx.hasOwnProperty(country)){
                // if exists sum one
                country2idx[country]++
            } else {
                country2idx[country] = 1
            }

            // Create items array
            var items = Object.keys(country2idx).map(function(key) {
                return [key, country2idx[key]];
            });

            // Sort the array based on the second element
            items.sort(function(first, second) {
                return second[1] - first[1];
            });

            // Cut slice
            categories = []
            values = []
            slice_items = items.slice(0, 12)

            for (i=0; i < slice_items.length; i++) {
                categories.push(slice_items[i][0])
                values.push(slice_items[i][1])
            }

            options.series[0].data = values
            options.xaxis.categories = categories

            changeData(options)

        }
    });
    callback()
}


// Box Map Init
var box_map = new mapboxgl.Map({
    container: 'viewshed',
    center: [-3.702, 40.417],
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: -0.80,
    zoomControl:false,
    interactive: false
});

// FlyTo click
box_map.on('click', function(e) {
    main_map.flyTo({
        center: [
            e.lngLat.wrap().lng,
            e.lngLat.wrap().lat
        ],
        zoom:6,
        essential: true
    });
});

// Add full-screen and navigation button
main_map.addControl(new mapboxgl.FullscreenControl());
main_map.addControl(new mapboxgl.NavigationControl());

// Event Listener to get value from flask-app - coord twts
var source = new EventSource(config.COORD_URL);
source.addEventListener('message', function(e){
    obj_twt_coord = JSON.parse(e.data);

    display_mk_main_map(obj_twt_coord);
    display_mk_box_map(obj_twt_coord);
}, false);

// Event Listener to get value from flask-app - general twts
var source = new EventSource(config.GENERAL_URL);
source.addEventListener('message', function(e){
    obj_twt = JSON.parse(e.data);

    document.getElementById("boxbar_txt").href = "https://twitter.com/" + obj_twt.screen_name;
    document.getElementById("boxbar_txt").innerHTML = obj_twt.twt;
}, false);

// Parameters
var n_markers = config.N_MARKERS
var opened = false;
var currentMarkers_main = [];
var currentMarkers_box = [];

// Function to display marker - MainMap
function display_mk_main_map(marker) {

    // Create html element to plot marker
    var el = document.createElement('div');
    el.className = 'marker';

    if (marker.img) {
        el.style.backgroundImage = 'url('+marker.img+')';
    }
    el.style.width = '50px';
    el.style.height = '50px';

    // Create popup
    var popup = new mapboxgl.Popup({ offset: 25 })
    popup['opened'] = false
    popup.setHTML('<div class="outer"><a class="box-text" style="text-decoration:none; color:black" href="http://twitter.com/"'+ marker.screen_name + '><b>Username: </b>' + marker.user + '<b><br>Tweet: </b>' + marker.twt + '</a><div class="pop_graph_up" id="pop_graph_up"></div><div class="pop_graph_down" id="pop_graph_down"></div></div>');

    // Create marker, add coordinates and popup.
    var marker_map = new mapboxgl.Marker(el)
        .setLngLat([marker.long, marker.lat])
        .setPopup(popup)
        .addTo(main_map);

    marker_map["OPENED"] = false

    // Get coordinates and update options - bar graph
    coord2place(lng_coord=marker.long, lat_coord=marker.lat, function() {
        j=0;
    });

    // Append market into array
    currentMarkers_main.push(marker_map);

    // We show 20 markers at the same time. This function deletes markers in order
    if (currentMarkers_main.length==n_markers){
        currentMarkers_main[0].remove();
        currentMarkers_main = currentMarkers_main.slice(currentMarkers_main.length-(n_markers-1))

    }
    // Change with the results from the model
    fwrg = marker.following
    fwrs = marker.followers

    len_fwrg = fwrg.toString().length
    len_fwrs = fwrs.toString().length

    var total_goals_fwrg = Math.pow(10, len_fwrg);
    var goals_completed_fwrg= fwrg;
    var total_goals_fwrs = Math.pow(10, len_fwrs);
    var goals_completed_fwrs= fwrs;

    popup.on('open', function(e) {
        var obj_popup = marker_map.getPopup()

        if (obj_popup.opened==false){
            bar_up = display_progress(content=pop_graph_up, color='#CFCF25', value_txt=fwrg)
            bar_down = display_progress(content=pop_graph_down, color='#CF9125', value_txt=fwrs)

            bar_up.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
            bar_up.text.style.fontSize = '0.5rem';
            bar_up.animate(goals_completed_fwrg/total_goals_fwrg);

            bar_down.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
            bar_down.text.style.fontSize = '0.5rem';
            bar_down.animate(goals_completed_fwrs/total_goals_fwrs);
        }

        var obj_opened_popup = marker_map.getPopup()
        obj_opened_popup['opened'] = true
    });
}

// Function to display marker - BoxMap
function display_mk_box_map(marker) {

    // Create html element to plot marker
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(../static/resources/Twitter_Logo.svg)';
    el.style.width = '14px';
    el.style.height = '14px';

    var marker_map_mb = new mapboxgl.Marker(el)
            .setLngLat([marker.long, marker.lat])
            .addTo(box_map);

    // Append market into array
    currentMarkers_box.push(marker_map_mb);

    // We show n_markers at the same time. This function deletes markers in order
    if (currentMarkers_box.length==n_markers){
        currentMarkers_box[0].remove();
        currentMarkers_box = currentMarkers_box.slice(currentMarkers_box.length-(n_markers-1))
    }
}

// Function to plot progress bar
function display_progress(content, color, value_txt){
    var progress_bar = new ProgressBar.Circle(content, {
        color: '#bcb',
        // This has to be the same size as the maximum width to prevent clipping
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
                circle.setText(String(value_txt));
            }
    }});
    return progress_bar
}

setTimeout(function() {
    if (options.xaxis.categories.length==0){
        make_tour()
    }
}, 15000);

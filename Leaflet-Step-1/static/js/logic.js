var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    console.log(data.features);
  });



function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function addTooltip(feature, mapObject) {
      mapObject.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: addTooltip,
      pointToLayer: style
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

    // Define a markerSize function that will give each city a different radius based on its population
function markerSize(mag) {
        if(mag === 0){ 
            return 1;
        }   
        return mag * 10000
      }



// function chooseColor(depth) {
//     if  (depth <= 10) {
//      return "green";
//     } else if (depth <= 30){
//         return "lightgreen";
//     } else if (depth <= 50){
//         return "lightorange";
//     } else if (depth <= 70){
//         return "orange";
//     }else {
//         return "red"
//     }
//   }
//color pallette from hex
function chooseColor(depth){
  switch(true){
    case depth > 89:
      return "#BB2528";
    case depth > 69:
      return "#D65D42";
    case depth > 49:
      return "#EA4630";
    case depth > 29:
      return " #F8B229";
    case depth > 9:
      return "#146B3A";
    case depth > -9:
      return "#165B33";
  }
}

function style(feature, latlng){
  return new L.circle(latlng, {
    opacity: 1,
    fillOpacity: 1,
    fillColor: chooseColor(feature.geometry.coordinates[2]),
    color:  "#0000000",
    radius: markerSize(feature.properties.mag),
    stroke: true,
    weight: 0.5

  })
};



// // Loop through the cities array and create one marker for each earthquake object
// for (var i = 0; i < .length; i++) {
//     L.circle(geometry[i].coordinates, {
//       fillOpacity: 0.75,
//       color: "chooseColor",
//       // Setting our circle's radius equal to the output of our markerSize function
//       // This will make our marker's size proportionate to its magnitude
//       radius: markerSize(properties.mag)
//     })
//   };

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
   // Define variables for our tile layers
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
    });
  
      
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Light Map": lightmap,
      };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [lightmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);


    function getColor(c){
      return c > 90 ? '#BB2528':
      
        c > 69 ? '#D65D42':
        c > 49 ? '#EA4630':
        c > 29 ? '#F8B229':
        c > 9 ? '#146B3A':
        c > -9 ? '#165B33':
                '#FFEDA0';
    };



    //legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

  legend.addTo(map);



  };
  
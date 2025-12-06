let selYr = "";

//year event listener
document.getElementById('yearC').addEventListener("change", function(event){
  selYr = (event.target.value!='Choose Year') ? event.target.value : "";
  console.log(selYr);
  updateMap();
})
  
//shelter choosing logic

function marker(lat, lon, name, students){
  this.lat = lat; 
  this.lon = lon; 
  this.name = name; 
  this.students = students; 
}

function markerList(selYr){
  //read through every line of the csv
  //append a new marker struct for each line
  //have initMap draw from the array produced by this function
}


// Initialize and add the map
let map;

updateMap();

async function initMap() {; 
  // The location of DC
  const position = { lat: 38.9072, lng: -77.0369 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at DC
  map = new Map(document.getElementById("map"), {
    zoom: 10,
    center: position,
    mapId: "DEMO_MAP_ID",
  });


   const marker1 = new AdvancedMarkerElement({
    map: map,
    position: {lat: 40.9072, lng: -77.0369},
    title: "Most in Common",
    gmpClickable: true,
  });
}

function updateMap(){
    initMap();
}


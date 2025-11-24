//shelter choosing logic




// Initialize and add the map
let map;

updateMap(map);

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

initMap(shelterList);

function updateMap(){
    initMap();
}


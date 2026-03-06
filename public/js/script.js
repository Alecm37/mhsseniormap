
let masterList = [];
let tempList = [];

async function fetch_data(){
    const res = await fetch("/api/csv/read/map.csv");
    return await res.json();
}

//year event listener
document.getElementById('yearC').addEventListener("change", function(event){
  tempList = [];
  const year = this.value; 
  for (let i = 0; i < masterList.length; i++){
    if (masterList[i].year === year){
      tempList.push(masterList[i]);
    }
  }
  console.log(tempList);

  initMap();
});



async function main(){
  masterList = await fetch_data();
  console.log(masterList);
}

function school(name, lat, lon, students){
    this.name = name; 
    this.lat = lat; 
    this.lon = lon; 
    this.students = students;
}


main();
  
let map;

async function initMap() {
  // The location of DC
  const position = { lat: 38.9072, lng: -77.0369 };
  // Request needed libraries.
  //@ts-ignore

  //instantiate the library
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at DC
  map = new Map(document.getElementById("map"), {
    zoom: 10,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  const infoWindow = new google.maps.InfoWindow();

  //sort by school:

  let name_registar = [];

  for (let i = 0; i < tempList.length; i++){
    let bool_in = false;
    for (let j = 0; j < name_registar.length; j++){
      if (name_registar[j]===tempList[i].uni){
        bool_in = true;
        break;
      }
    }
    if (!bool_in){
      name_registar.push(tempList[i].uni);
    }
  }

  //school object array

  let schools = [];

  for (let i = 0; i < name_registar.length; i++){
    let students = [];
    let lat; 
    let lon;
    for (let j = 0; j < tempList.length; j++){
      
      if(tempList[j].uni===name_registar[i]){
        students.push(tempList[j].Name);
        lat = tempList[j].lat;
        lon = tempList[j].lon;
      }
    }
    const s = new school(name_registar[i], lat, lon, students);
    schools.push(s);
  }

  
  for (let i = 0; i < schools.length; i++){
    let sub = "";
    for (let j = 0; j < schools[i].students.length; j++){
        sub+=schools[i].students[j]+"<br>"; 
    }
    const marker = new AdvancedMarkerElement({
    map: map,
    position: {lat: parseFloat(schools[i].lat), lng: parseFloat(schools[i].lon)},
    title: "Most in Common",
    gmpClickable: true,
    });
    marker.addListener("click", () => {
      infoWindow.setContent(`
        <div>
          <h3>${schools[i].name}</h3>
          <p>${sub}</p>
        </div>
      `);
      infoWindow.open(map, marker);
    });
    }
  }


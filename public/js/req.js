let Name; 
let uni; 
let year; 
let lon; 
let lat; 

document.getElementById('name_req').addEventListener("input", function(event){
    Name = event.target.value; 
});

document.getElementById('uni_req').addEventListener("input", function(event){
    uni = event.target.value; 
});

document.getElementById('year_req').addEventListener("input", function(event){
    year = event.target.value; 
});

document.getElementById('lon_req').addEventListener("input", function(event){
    lon = event.target.value; 
});

document.getElementById('lat_req').addEventListener("input", function(event){
    lat = event.target.value; 
});


document.getElementById('button_req').addEventListener("click", async() => {
    const row = { Name, uni, year, lon, lat};

    const res = await fetch("/api/csv/append", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            filename: "interim.csv", 
            row: row
        })
    });
    if (!res.ok){
        const text = await res.text();
        console.error("Server error:", text);
        return;
    }
    
});
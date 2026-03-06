async function fetch_data(){
    const res = await fetch("/api/csv/read/interim.csv");
    return await res.json();
}

function sort(data){
    for (let i = 0; i < data.length; i++){
        let curr_max = parseInt(data[i].year, 10);
        let curr_ind = i; 
        for (let j = i; j < data.length; j++){
            if (curr_max < parseInt(data[j].year, 10)){
                curr_max = parseInt(data[j].year, 10);
                console.log(curr_max);
                curr_ind = j; 
            }
        }
        let temp = data[i];
        data[i] = data[curr_ind];
        data[curr_ind] = temp; 
    }
    return data; 
}

function create_elements(data){
    for (let i = 0; i < data.length; i++){
        const row = { Name: data[i].Name, uni: data[i].uni, year: data[i].year, lon: data[i].lon, lat: data[i].lat} ;
        const div = document.createElement("div");
        const p = document.createElement("p");
        const add_button = document.createElement("button");
        const remove_button = document.createElement("button");

        p.textContent = `${data[i].Name.toString()}, ${data[i].uni.toString()}, ${data[i].year.toString()} `;
        add_button.textContent = "Append";
        remove_button.textContent = "Delete";

        add_button.addEventListener("click", async function(){
            //append to respective year file:
            const appendRes = await fetch("/api/csv/append", {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: `map.csv`, 
                    row: row
                })
            });

            if (!appendRes.ok){
                const text = await appendRes.text();
                console.error("Server error:", text);
                return;
            }

            const deleteRes = await fetch("/api/csv/delete", {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: `interim.csv`,
                    criteria: row
                })
            });

            if (!deleteRes.ok){
                const text = await deleteRes.text();
                console.error("Server error:", text);
                return;
            }
            location.reload();
            //delete from interim:

        });

        remove_button.addEventListener("click", async function(){
            //delete from interim:
            const res = await fetch("/api/csv/delete", {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: `interim.csv`,
                    criteria: row
                })
            });
            location.reload();
        });
        div.appendChild(p);
        div.appendChild(add_button);
        div.appendChild(remove_button);
        document.body.append(div);
    }
}

async function main(){
    let data = await fetch_data();
    data = sort(data);
    console.log(data);
    create_elements(data);
}

main();
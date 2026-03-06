import express from "express";
import { spawn } from "child_process";
import path from "path";

const __dirname = import.meta.dirname;

const app = express();
const PORT = 3000; 

app.use(express.json());

function runPython(script, args = []){
  return new Promise((resolve, reject) => {
    const filename = args.find(a => typeof a === "string" && a.endsWith(".csv"));

    if (typeof filename !== "string" || !/^[a-zA-Z0-9_.-]+\.csv$/.test(filename)){
      return reject (new Error("invalid filename"));
    }

    const py = spawn('python3', [
      path.join(__dirname, 'backend', script), 
      ...args
    ]);

    let output = "";
    let error = "";

    py.stdout.on("data", data => output += data.toString());
    py.stderr.on("data", data => error += data.toString());

    py.on('close', (code) => {
      if (code === 0){
        try {
          const parsed = JSON.parse(output);
          resolve(parsed); 
        } catch(e) {
          reject('Failed to parse Python output as JSON' + e.message);
        }
      } else {
        reject(new Error(
          `Python exited with ${code}\nSTDERR:\n${error}\nSTDOUT:\n${output}`
        ));
      }
    });
  });
}

app.get("/api/csv/read/:file", async (req, res) => {

  try {
    const filename = req.params.file; 
    const result = await runPython("handler.py", [
      "read",
      filename
    ]);

    res.json(result);
  } catch(err) {
    console.error("READ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
  console.log("REQ BODY:", req.body);
});

app.post("/api/csv/append", async (req, res) => {
  try{
    const {filename, row} = req.body; 
    const result = await runPython("handler.py", [
      "append",
      filename, 
      JSON.stringify(row)
    ]);
    res.json(result);
  } catch(err) {
    console.error("APPEND ERROR", err);
    res.status(500).json({ error: err.message || "Append failed" });
  }
});

app.post("/api/csv/delete", async(req, res) => {
  try{
    const { filename, criteria } = req.body; 
    const result = await runPython("handler.py", [
      "delete",
      filename, 
      JSON.stringify(criteria)
    ]);
    res.json({ status: "deleted" });
  } catch(err) {
    console.error("DELETE ERROR", err);
    res.status(500).json({ error: err.message || "Delete failed" });
  }
});

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
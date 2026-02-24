const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Create database file
const db = new sqlite3.Database("./database.sqlite");

// Create table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      message TEXT
    )
  `);
});

// POST route
app.post("/submit", (req, res) => {
  const { name, message } = req.body;

  db.run(
    "INSERT INTO feedback (name, message) VALUES (?, ?)",
    [name, message],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Saved Successfully" });
    }
  );
});

// GET route (moved outside)
/*app.get("/feedbacks", (req, res) => {
  db.all("SELECT * FROM feedback", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});*/
app.get("/all", (req,res)=>{
  db.all("SELECT * FROM feedback",(e,r)=>res.json(r));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




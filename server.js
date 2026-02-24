const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

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

app.post("/submit", (req, res) => {
  const { name, message } = req.body;
  app.get("/feedbacks", (req, res) => {
  db.all("SELECT * FROM feedback", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
import express from "express";
import mysql from "mysql2/promise";
import multer from "multer";

const app = express();
const upload = multer({ dest: "uploads/" });

// JSON-Body erlauben
app.use(express.json());

// MySQL Verbindung
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Startseite
app.get("/", (req, res) => {
  res.send("myFoods Cloud läuft");
});

// Alle Orders abrufen
app.get("/orders", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB query failed" });
  }
});

// JSON automatisch in DB speichern
app.post("/orders", async (req, res) => {
  try {
    const { customer, items, status } = req.body;

    const [result] = await db.execute(
      "INSERT INTO orders (customer, items, status) VALUES (?, ?, ?)",
      [customer, items, status]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB insert failed" });
  }
});

// File Upload
app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded");
});

// Server starten
app.listen(3000, () => console.log("Server läuft"));

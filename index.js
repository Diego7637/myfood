import express from "express";
import mysql from "mysql2/promise";
import multer from "multer";

const app = express();
const upload = multer({ dest: "uploads/" });

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

app.get("/", (req, res) => {
  res.send("myFoods Cloud läuft");
});

app.get("/orders", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM orders");
  res.json(rows);
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded");
});

app.listen(3000, () => console.log("Server läuft"));

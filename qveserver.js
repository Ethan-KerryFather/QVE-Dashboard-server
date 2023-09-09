import { config } from "dotenv";
config();
import cors from "cors";
import express from "express";
import { createPool } from "mariadb";
import JSONbig from "json-bigint";

const app = express();
app.use(cors());
const port = 3001;

const pool = createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: "data",
  connectionLimit: 5,
});

app.get("/", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const data = await conn.query(
      "select * from wallet_balances where owner_name = ?",
      ["jung"]
    );
    res.send(JSONbig.stringify(data));
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  } finally {
    if (conn) conn.release();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// server.mjs (หรือ index.mjs)
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import router from "./src/routes/userRoutes.js";
import { initMiddleware } from "./src/middlewares/middleware.js";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";


dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public")); //ให้ Express เสิร์ฟไฟล์ static

app.use('/.well-known/appspecific/com.chrome.devtools.json', (req, res, next) => {
  // ตอบ 204 (No Content) ถ้าคุณอยากไม่แสดง 401 ให้คนข้างนอกเห็น
  res.status(204).end();
});

initMiddleware(app); // เรียกใช้ middleware

app.use("/", router); // ใช้ userRoutes สำหรับเส้นทาง /api/users




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
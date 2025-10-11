// server.mjs (หรือ index.mjs)
import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import router from "./src/routes/userRoutes.js";
import { initMiddleware } from "./src/middlewares/middleware.js";
import { requireAuth } from "./src/middlewares/auth.js";
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
app.use(session({
  secret: "mySecretKey",
  resave: false,
  saveUninitialized: true
}));

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
initMiddleware(app);


// Serve the /page folder behind auth: any request to /page/* will go through requireAuth
app.use('/page', requireAuth, express.static(path.join(__dirname, 'public', 'page')));

// Serve other public static files (css, js, images, root index.html, etc.)
app.use(express.static(path.join(__dirname, 'public'))); 


app.use('/.well-known/appspecific/com.chrome.devtools.json', (req, res, next) => {
 
  res.status(204).end();
});

app.use("/", router); // mount routes

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// API endpoint สำหรับอัพเดตรหัสผ่าน
app.post("/api/update-password", async (req, res) => {
    
  console.log("Session data:", req.session);
  const userId = req.session.user?.usersid; // ✅ ถ้า session เก็บเป็น object
  console.log("Updating password for user:", userId);

    const { password } = req.body;
    try {
        // hash รหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);

        // update ลง database
        await pool.query(
            "UPDATE users SET password=$1 WHERE usersid=$2",
            [hashedPassword, userId]
        );

        res.json({ success: true });
        console.log("Updating password for user:", userId);
    } catch (err) {
        console.error(err);
        res.json({ success: false, error: err.message });
    }
});
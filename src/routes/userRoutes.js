// src/routes/userRoutes.js
import express from "express";
import bodyParser from "body-parser";
import { getUsers , login , getProblemlist, getUser} from "../controllers/usersController.js";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth , authGuard , sessionMiddleware , attachUser} from "../middlewares/auth.js";
import { get } from "http";
const router = express.Router();


const __dirname = dirname(fileURLToPath(import.meta.url));

// POST /api/users/register → สมัครสมาชิก
//router.post("/register", registerUser);

// GET /api/users → ดึงผู้ใช้ทั้งหมด
router.get("/getUser", getUsers);

// DELETE /api/users/:id → ลบผู้ใช้ตาม id
//router.delete("/:id", deleteUser);
router.post("/login", login);

router.get("/newPassword", requireAuth, authGuard , (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/newPassword.html");
  return res.sendFile(filePath);
});

router.get("/home", requireAuth, authGuard , (req, res) => {
  console.log("เข้า /home สำเร็จ, user =", req.session.user);
  const filePath = path.join(__dirname, "../../public/page/home.html");
  return res.sendFile(filePath);
});

router.get("/main", requireAuth, (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/main.html");
  return res.sendFile(filePath);
});

router.get("/main/data", requireAuth, getProblemlist); 

router.get("/login", (req, res) => {
  return res.redirect('/');
});

router.get("/main/home/data", requireAuth, getUser);

router.get("/main/home", requireAuth,(req, res) => {
  const filePath = path.join(__dirname, "../../public/page/home.html");
  return res.sendFile(filePath);
});

export default router;
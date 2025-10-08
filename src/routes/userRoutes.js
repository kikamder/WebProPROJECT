// src/routes/userRoutes.js
import express from "express";
import bodyParser from "body-parser";
import { getUsers, getUser} from "../controllers/usersController.js";
import { getProblemlist } from "../controllers/problemController.js";
import { changePassword, login } from "../controllers/authController.js";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth , authGuard , sessionMiddleware , attachUser, redirectIfAuth} from "../middlewares/auth.js";
const router = express.Router();


const __dirname = dirname(fileURLToPath(import.meta.url));

// POST /api/users/register → สมัครสมาชิก
//router.post("/register", registerUser);

// GET /api/users → ดึงผู้ใช้ทั้งหมด
router.get("/getUser", getUsers);
router.get("/login", redirectIfAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html")); 
});



router.post("/login", login)
router.post("/login/changepassword" , requireAuth,changePassword);


router.get("/home/problemlist", requireAuth, (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/main.html");
  return res.sendFile(filePath);
});

router.get("/home", requireAuth,(req, res) => {
  const filePath = path.join(__dirname, "../../public/page/home.html");
  return res.sendFile(filePath);
});

router.get("/main/home/data",requireAuth, getUser);
router.get("/main/data", requireAuth, getProblemlist);


export default router;
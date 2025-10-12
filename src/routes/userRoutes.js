// src/routes/userRoutes.js
import express from "express";
import bodyParser from "body-parser";
import { getUsers, getUser} from "../controllers/usersController.js";
import { getProblemlist ,getProblemlastest} from "../controllers/problemController.js";
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


router.get("/main/problemlist", requireAuth, (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/problemTable.html");
  return res.sendFile(filePath);
});

router.get("/main", requireAuth,(req, res) => {
  const filePath = path.join(__dirname, "../../public/page/home.html");
  return res.sendFile(filePath);
});
router.get("/main/reportProblem", requireAuth,(req, res) => {
  const filePath = path.join(__dirname, "../../public/page/problemForm.html");
  return res.sendFile(filePath);
});

router.get("/main/data",requireAuth, getUser);
router.get("/main/problemlist/data", requireAuth, getProblemlist);

router.get("/main/problemlastest/data", getProblemlastest , (req, res) => {

});


export default router;
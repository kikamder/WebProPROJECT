// src/routes/userRoutes.js
import express from "express";
import bodyParser from "body-parser";
import { getUsers , login , getProblemlist} from "../controllers/usersController.js";
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
router.post("/login", login)

router.get("/main", requireAuth, (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/main.html");
  return res.sendFile(filePath);
});


router.get("/main/data", requireAuth, getProblemlist);

export default router;
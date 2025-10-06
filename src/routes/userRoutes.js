// src/routes/userRoutes.js
import express from "express";
import bodyParser from "body-parser";
import { getUsers , login} from "../controllers/usersController.js";

const router = express.Router();

// POST /api/users/register → สมัครสมาชิก
//router.post("/register", registerUser);

// GET /api/users → ดึงผู้ใช้ทั้งหมด
router.get("/getUser", getUsers);

// DELETE /api/users/:id → ลบผู้ใช้ตาม id
//router.delete("/:id", deleteUser);
router.post("/login", login)

export default router;
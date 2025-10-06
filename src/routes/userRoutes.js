// src/routes/userRoutes.js
import express from "express";
import { getUsers} from "../controllers/usersController.js";

const router = express.Router();

// POST /api/users/register → สมัครสมาชิก
//router.post("/register", registerUser);

// GET /api/users → ดึงผู้ใช้ทั้งหมด
router.get("/", getUsers);

// DELETE /api/users/:id → ลบผู้ใช้ตาม id
//router.delete("/:id", deleteUser);

export default router;
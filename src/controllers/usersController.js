// src/controllers/userController.js
import pool from "../dbConfig/db.js";  // ดึง pool ที่ connect DB
import bcrypt from "bcrypt";

// สมัครสมาชิก
// export const registerUser = async (req, res) => {
//   const { fullname, username, password } = req.body;
//   try {
//     // hash password ก่อนเก็บ
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const q = `
//       INSERT INTO users (fullname, username, password, role, status)
//       VALUES ($1, $2, $3, $4, $5)
//       RETURNING user_id, fullname, username, role, status
//     `;

//     const values = [fullname, username, hashedPassword, "student", true];
//     const { rows } = await pool.query(q, values);

//     res.status(201).json(rows[0]);  // ส่ง user ที่สร้างกลับไป
//   } catch (err) {
//     console.error("Register error:", err);
//     res.status(500).json({ error: "ไม่สามารถสมัครสมาชิกได้" });
//   }
// };

// ดึง users ทั้งหมด

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("email : " ,email);
  try {
    const q = `
      SELECT 
        u.firstname,
        u.lastname,
        t.teamname,
        r.rolename,
        u.phonenumber,
        u.ispasswordchange
      FROM users u
      JOIN role r ON u.roleid = r.roleid
      JOIN teams t ON u.teamid = t.teamid
      WHERE u.usersemail = $1
        AND u.password = crypt($2, u.password)
      LIMIT 1;
    `;

    const { rows } = await pool.query(q, [email, password]);
    
    if (rows.length === 0) {
      return res.status(401).send("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกระงับ");
    }

  // redirect to the public URL - express.static serves files under /public
  return res.redirect("/page/main.html");
  } catch (e) {
    console.error(e);
    res.status(500).send("เกิดข้อผิดพลาดภายในระบบ");
  }
};

export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM users
    `);
    res.json(rows);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "ดึงข้อมูล users ไม่ได้" });
  }
};

// ลบ user ตาม id
// export const deleteUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await pool.query(`DELETE FROM users WHERE user_id = $1`, [id]);
//     res.json({ message: "ลบผู้ใช้เรียบร้อย" });
//   } catch (err) {
//     console.error("Delete user error:", err);
//     res.status(500).json({ error: "ไม่สามารถลบ user ได้" });
//   }
// };

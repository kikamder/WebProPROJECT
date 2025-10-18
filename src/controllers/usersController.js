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


export const getUser = async (req, res) => {
  try {
    const userId = (req.session && req.session.user && req.session.user.usersid) || req.session.usersid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No session" });
    }

    const result = await pool.query(`
      SELECT 
        u.firstname,
        u.lastname,
        CONCAT(u.firstname ,' ', u.lastname) AS fullname,
        t.teamname,
        r.rolename,
        u.phonenumber,
        u.ispasswordchange
      FROM users u
      JOIN role r ON u.roleid = r.roleid
      JOIN teams t ON u.teamid = t.teamid
      WHERE u.usersid = $1
      LIMIT 1;
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ดึง users ทั้งหมด
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

export const getTechHome = async (req, res) => {
  try {
    const userId = req.user.usersid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No session" });
    }
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) 
        FROM Problem p
        JOIN workassignment wk ON p.problemid = wk.problemid
        WHERE wk.usersid = $1
        ) AS total_work,

        (SELECT COUNT(*) 
        FROM Problem p
        JOIN workassignment wk ON p.problemid = wk.problemid
        WHERE wk.usersid = $1 AND p.statusid = 2
        ) AS in_progress,

        (SELECT COUNT(*) 
        FROM Problem p
        JOIN workassignment wk ON p.problemid = wk.problemid
        WHERE wk.usersid = $1 AND p.statusid = 3
        ) AS pending,

        (SELECT COUNT(*) 
        FROM Problem p
        JOIN workassignment wk ON p.problemid = wk.problemid
        WHERE wk.usersid = $1 AND p.statusid = 4
        ) AS resolved;

    `, [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getuserHome = async (req, res) => {
    const userId = req.user.usersid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No session" });
    }

    try {
      const result = await pool.query(`
        SELECT 
          (SELECT COUNT(*) 
          FROM Problem p
          JOIN users u on p.createby = u.usersid
          WHERE p.createby = $1
          ) AS total_work,

          (SELECT COUNT(*) 
          FROM Problem p
          JOIN users u ON p.createby = u.usersid
          WHERE p.createby = $1 AND p.statusid = 1
          ) AS newProblem,
      
          (SELECT COUNT(*) 
          FROM Problem p
          JOIN users u ON p.createby = u.usersid
          WHERE p.createby = $1 AND p.statusid = 2
          ) AS in_progress,

          (SELECT COUNT(*) 
          FROM Problem p
          JOIN users u ON p.createby = u.usersid
          WHERE p.createby = $1 AND p.statusid = 3
          ) AS pending,

          (SELECT COUNT(*) 
          FROM Problem p
          JOIN users u ON p.createby = u.usersid
          WHERE p.createby = $1 AND p.statusid = 4
          ) AS resolved;
        `,[userId]);
        res.json(result.rows[0]);


    } catch(error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Server error" });
    }
};

export const getadminHome =  (res,req) => {

}
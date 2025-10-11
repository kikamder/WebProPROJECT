// src/controllers/userController.js
import pool from "../dbConfig/db.js";  // ดึง pool ที่ connect DB
import bcrypt from "bcrypt";
import crypto from "crypto"; // ใช้กรณี hash เดิมเป็น crypt

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


//ของแฟน
// export const login = async (req, res) => {
//   const { email, password } = req.body; // email ,password สร้างตัวแปรมารับข้อมูล จาก req.body
//   try {
//     const q = `
//       SELECT 
//         u.usersid,
//         u.firstname,
//         u.lastname,
//         t.teamname,
//         r.rolename,
//         u.ispasswordchange
//       FROM users u
//       JOIN role r ON u.roleid = r.roleid
//       JOIN teams t ON u.teamid = t.teamid
//       WHERE u.usersemail = $1
//         AND u.password = crypt($2, u.password)
//       LIMIT 1; 
//     `;

//     const { rows } = await pool.query(q, [email, password]); 
    
    
//     if (rows.length === 0) {
//       return res.status(401).send("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกระงับ");
//     }

//     const u = rows[0]; //เอาคนที่เราquery มาเก็บไว้ใน  const u 
//     req.session.user = {
//       usersid: u.usersid,
//       firstname: u.firstname,
//       lastname: u.lastname,
//       teamname : u.teamname,
//       rolename: u.rolename,
//       ispasswordchange: u.ispasswordchange,
//     };
//   if(rows.ispasswordchange === false){
    
//   }
//   return res.redirect("/newPassword");
//   } catch (e) {
//     console.error(e);
//     res.status(500).send("เกิดข้อผิดพลาดภายในระบบ");
//   }
// };

//แบบใหม่
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const q = `
      SELECT 
        u.usersid,
        u.firstname,
        u.lastname,
        u.password,  -- ต้องดึง hash ออกมาด้วย
        t.teamname,
        r.rolename,
        u.ispasswordchange
      FROM users u
      JOIN role r ON u.roleid = r.roleid
      JOIN teams t ON u.teamid = t.teamid
      WHERE u.usersemail = $1
      LIMIT 1;
    `;

    const { rows } = await pool.query(q, [email]);

    if (rows.length === 0) {
      return res.status(401).send("ไม่พบผู้ใช้");
    }

    const user = rows[0];
    const hashed = user.password;

    let isMatch = false;

    // ✅ ตรวจว่ารหัสผ่านใน DB เป็น bcrypt หรือ crypt แบบเก่า
    if (hashed.startsWith("$2b$") || hashed.startsWith("$2a$")) {
      // → เป็น bcrypt
      isMatch = await bcrypt.compare(password, hashed);
    } else {
      // → เป็น crypt เดิม (ตัวอย่างเช่น DES/MD5)
      // หมายเหตุ: คุณอาจต้องปรับสูตรให้ตรงกับรูปแบบจริงของระบบเก่า
      const salt = hashed.substring(0, 2); // crypt เก่ามักใช้ 2 ตัวแรกเป็น salt
      const legacyHash = crypto.createHash("md5").update(password + salt).digest("hex");

      // ถ้า hash เดิมเป็นแบบ md5 หรือแบบที่เก็บ plain ไว้
      if (legacyHash === hashed || password === hashed) {
        isMatch = true;
      }
    }

    if (!isMatch) {
      return res.status(401).send("รหัสผ่านไม่ถูกต้อง");
    }

    // ✅ ตั้งค่า session
    req.session.user = {
      usersid: user.usersid,
      firstname: user.firstname,
      lastname: user.lastname,
      teamname: user.teamname,
      rolename: user.rolename,
      ispasswordchange: user.ispasswordchange,
    };

    // ✅ redirect ไปยังหน้าเปลี่ยนรหัสหรือหน้า home
    if (!user.ispasswordchange) {
      return res.redirect("/newPassword");
    }

     return res.redirect("/home");
  } catch (e) {
    console.error(e);
    res.status(500).send("เกิดข้อผิดพลาดภายในระบบ");
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


export const getProblemlist = async (req, res) =>  {
  try {
    const result = await pool.query(`
      SELECT 
        p.problemid,
        p.title,
        p.description,
        p.createat,
        p.location,
        u.firstname AS createdby,
        c.categoryname,
        s.statusstate,
        d.departmentname,
        sla.prioritylevel,
        p.comment
      FROM Problem p
      JOIN Users u ON p.createby = u.usersid
      JOIN Category c ON p.categoryid = c.categoryid
      JOIN Status s ON p.statusid = s.statusid
      JOIN Department d ON p.departmentid = d.departmentid
      JOIN ServiceLevelAgreement sla ON p.priorityid = sla.priorityid
      ORDER BY p.problemid ASC
      LIMIT 20;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ดึงข้อมูลผู้ใช้ปัจจุบัน
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
        t.teamname,
        r.rolename,
        u.phonenumber,
        u.ispasswordchange
      FROM users u
      JOIN role r ON u.roleid = r.roleid
      JOIN teams t ON u.teamid = t.teamid
      WHERE u.usersid = $1
      LIMIT 1`
      , [userId] 
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }


    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
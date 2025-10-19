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
        u.usersemail,
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

export const getUserParm = async (req, res) => {
  try {
    const userId = req.params.userid;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No session" });
    }

    const result = await pool.query(`
      SELECT 
        u.firstname,
        u.lastname,
        CONCAT(u.firstname ,' ', u.lastname) AS fullname,
        u.usersemail,
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

export const getadminHome = async (req,res) => {

  try{
    const result = await pool.query(`
       SELECT 
          (SELECT COUNT(*) 
          FROM Problem p
          ) AS total_problem,

          (SELECT COUNT(*) 
          FROM Problem p
          WHERE p.statusid = 1
          ) AS total_newProblem,
      
          (SELECT COUNT(*) 
          FROM Problem p
          WHERE p.statusid = 2 OR p.statusid = 3
          ) AS total_in_progress,

          (SELECT COUNT(*) 
          FROM Problem p
          WHERE p.statusid = 4
          ) AS total_resolved,

		  (SELECT COUNT(*) 
          FROM users u
          ) AS total_Employee,
		  
		  (SELECT COUNT(*) 
          FROM users u WHERE u.roleid !=2 AND u.roleid !=3
          ) AS total_normalEmployee,
		  
		  (SELECT COUNT(*) 
          FROM users u WHERE u.roleid =3
          ) AS total_technician,
		  
		  (SELECT COUNT( DISTINCT wk.usersid)
			FROM workassignment wk
			JOIN problem p on wk.problemid = p.problemid
			WHERE p.statusid != 4
          ) AS total_technicianHaswork,

      (SELECT COUNT(DISTINCT w.problemid)
     FROM workassignment w
     JOIN problem p ON w.problemid = p.problemid
     JOIN servicelevelagreement s ON p.priorityid = s.priorityid
     WHERE w.finishat IS NOT NULL
       AND EXTRACT(EPOCH FROM (w.finishat - w.assignat)) / 60 > s.resolvetime
    ) AS total_overdueProblem;
		  `);
      res.json(result.rows[0]);
  }catch(error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Server error" });
  }
}

export const getUserAll = async (req,res) => {
  try {
    const result = await pool.query(`
        SELECT 
        u.usersid,
        u.usersemail,
        CONCAT(u.firstname,' ' ,u.lastname) AS fullname,
        t.teamname,
        d.departmentname,
        u.phonenumber
      FROM users u
      JOIN role r ON u.roleid = r.roleid
      JOIN teams t ON u.teamid = t.teamid
      JOIN department d ON t.departmentid = d.departmentid
      ORDER BY u.usersid;
      `);
      res.json(result.rows);

  } catch (error) {
    console.log("DB ERROR: " , error);
    res.status(500).json();
  }
}

export const getTeam = async (req, res) => {
  try {
    const result = await pool.query("SELECT * from teams");
      console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
      console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด จาก DB" });
  }
};

export const getRole = async (req,res) => {
  try {
      const result = await pool.query("SELECT * FROM role");
        console.log(result.rows);
      res.json(result.rows);
    } catch (err) {
        console.error(err);
      res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
};


export const submitEditUser = async (req,res) => {
  try {
    const userid = req.body.userid;
    const usersemail = req.body.email;
    const firstname = req.body.firstName123;
    const lastname = req.body.lastName123;
    const teamid = req.body.teamid;
    // const teamname = req.body.teamname;
    const roleid = req.body.roleid;
    // const rolename = req.body.rolename;

      const result = await pool.query(`
        UPDATE users
        SET firstname = $1, lastname = $2, usersemail = $3, teamid = $4, roleid = $5
        WHERE usersid = $6;
        `,[firstname,lastname,usersemail,teamid,roleid,userid]);
        
      res.json({success  : true});
    } catch (err) {
        console.error(err);
      res.status(500).json({ error: "เกิดข้อผิดพลาด" });
    }
};

export const adduser = async (req,res) => {
  try {
    const { firstname, lastname, email, password, teamId, roleId } = req.body;
    const createat = new Date();// เวลาปัจจุบัน
    const result = await pool.query(`
      INSERT INTO users (firstname, lastname, usersemail, password, teamid, roleid,createat)
      VALUES ($1, $2, $3,crypt($4, gen_salt('bf')), $5, $6,NOW());
    `, [firstname, lastname, email, password, teamId, roleId]);
    res.json({ success: true});
  } catch (err) {
    console.error(" Error inserting user:", err);
    res.json({ success: false, message: err.message });
  }
};

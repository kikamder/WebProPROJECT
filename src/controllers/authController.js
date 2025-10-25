import pool from "../dbConfig/db.js";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";


const __dirname = dirname(fileURLToPath(import.meta.url));

  //==============================================
  // ปุ่ม log out
  //==============================================
export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

  //==============================================
  // ปุ่ม log in
  //==============================================
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("email : " ,email);
  try {
    const q = `
      SELECT 
        u.usersid,
        u.firstname,
        u.lastname,
        t.teamname,
        r.rolename,
        d.departmentname,
        u.ispasswordchange
      FROM users u
      JOIN role r ON u.roleid = r.roleid
      JOIN teams t ON u.teamid = t.teamid
      JOIN department d ON t.departmentid = d.departmentid
      WHERE u.usersemail = $1 
        AND u.password = crypt($2, u.password)
      LIMIT 1;
    `;

    const { rows } = await pool.query(q, [email, password]);
    
    
    if (rows.length === 0) {
      return res.status(401).send("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกระงับ");
    }
    const u = rows[0];
    if(u.rolename == 'None') {
      return res.status(401).send("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกระงับ");
    }
    
    req.session.user = {
      usersid: u.usersid,
      firstname: u.firstname,
      lastname: u.lastname,
      teamname : u.teamname,
      departmentname: u.departmentname,
      rolename: u.rolename,
      ispasswordchange: u.ispasswordchange,
    };

    console.log('ข้อมูล Session User:', req.user);
  if(u.ispasswordchange === false){
    return res.redirect("/changepassword");
  }
  if(u.rolename == "Admin") return res.redirect("/AdMain");

  return res.redirect("/main");
  } catch (e) {
    console.error(e);
    res.status(500).send("เกิดข้อผิดพลาดภายในระบบ");
  }
};


  //==============================================
  // สำหรับ form เปลี่ยนรหัส
  //==============================================
export const changePassword = async (req, res) => {
  const { password, confirm_password } = req.body;
  if(password != confirm_password) {
    return res.json({ message : "รหัสผ่านไม่ตรงกัน"})
  }
  try{
  const q = `
    UPDATE users
    SET password = crypt($1, gen_salt('bf')),
        ispasswordchange = true
    WHERE usersid = $2
  `;
  const {rows} = await pool.query(q,[confirm_password, req.session.user.usersid]);
  console.log('ข้อมูล Session User:', req.user);
  return res.json({success : true});

  }catch(error) {
    console.error(error);
    return res.status(500).json({message : "เกิดข้อผิดพลาด"})
  }
  
};


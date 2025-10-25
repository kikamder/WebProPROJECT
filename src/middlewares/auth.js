import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import pool from "../dbConfig/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
  //================================================
  // สำหรับการเช็คสิทธิ์ ถ้ายังไม่มีให้ไป login
  //=================================================
export const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login');
    }
    next();
}

  //================================================
  // สำหรับ ถ้า loginแล้ว แล้วจะไป /login จะไม่ให้ไป
  //=================================================
export const redirectIfAuth = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/main');
  }
  next(); // ถ้ายังไม่ล็อกอิน ให้ผ่านไปได้ (เพื่อให้เห็นหน้าฟอร์ม)
};


  //================================================
  // สำหรับให้ express ให้สิทธิ์เข้าถึงของไฟล์ 
  //=================================================
export const authGuard = (req, res, next) => {
    // Allow some public paths (login-related and API)
    const openPaths = ["/", "/login", "/logout", "/getUser"];
    // Allow static asset prefixes (so css/js/images load without auth)
    const openPrefixes = ["/css", "/js", "/images", "/img", "/assets", "/fonts", "/favicon.ico"];
    if (openPaths.includes(req.path) || openPrefixes.some(p => req.path.startsWith(p))) {
      return next(); // allow index, login and static assets
    }
    
    return requireAuth(req, res, next);
};

  //================================================
  // อันนี้ เป็นการสร้างตาราง session เฉยๆ ไม่ค่อยเข้าใจเหมือนกัน 
  //=================================================
const PgSession = connectPgSimple(session);
export const sessionMiddleware = session({
  store: new PgSession({ 
    pool, 
    tableName: "session", 
    createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || "dev-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { 
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 },
      
});


  //================================================
  // แนบข้อมูลของ sesstion ให้ใช้ได้ใน req.user จะได้ไม่ต้องเขียนยาว
  //=================================================
export const attachUser = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;

  }
  next();
};


  //================================================
  // สำหรับการให้สิทธิ์แต่ละ role ในการเข้าถึงอะไรต่างๆ
  //=================================================
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.session.user;

    // 1. ถ้ายังไม่ล็อกอิน → กลับไป login
    if (!user) {
      return res.redirect('/login');
    }

    // 2. ถ้ามี role ตรงกับที่อนุญาต → ผ่าน
    if (allowedRoles.includes(user.rolename)) {
      return next();
    }

    // 3. ถ้า role ไม่ตรง → redirect ตามสิทธิ์
    if (user.rolename === "Admin") {
      return res.redirect('/Admain');
    } else {
      return res.redirect('/main');
    }
  };
};
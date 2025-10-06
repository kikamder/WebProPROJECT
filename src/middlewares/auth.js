import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";




const __dirname = dirname(fileURLToPath(import.meta.url));

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).sendFile(path.join(__dirname , "../../public/page/index.html")); // ถ้าไม่มี user ให้ส่งไฟล์ index.html ไป
  }
  next();
}



export const authGuard = (req, res, next) => {
    const openPaths = ["/", "/login", "/logout","/getUser"];
    if (openPaths.includes(req.path)) {
      return next(); // ✅ อนุญาตให้เข้า index.html โดยไม่ต้อง login
    }
    return requireAuth(req, res, next);
};
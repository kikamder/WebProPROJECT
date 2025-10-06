import { dirname } from "path";
import { fileURLToPath } from "url";




const __dirname = dirname(fileURLToPath(import.meta.url));

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).sendFile(__dirname + "../../public/index.html");
  }
  next();
}

app.use((req, res, next) => {
  const openPaths = ["/", "/login", "/logout"];
  if (openPaths.includes(req.path)) {
    return next(); 
  }
  return requireAuth(req, res, next); 
});
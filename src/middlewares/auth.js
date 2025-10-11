import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import pool from "../dbConfig/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const requireAuth = (req, res, next) => {
  // Prefer checking session directly. If no session user, redirect to login page (/)
  if (!req.session || !req.session.user) {
    
    return res.redirect('/');
  }
  next(); 
}

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
      maxAge: 1000 * 60 * 15 },
});


export const attachUser = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  next();
};


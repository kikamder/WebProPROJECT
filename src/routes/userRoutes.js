// src/routes/userRoutes.js
import express from "express";
import bodyParser from "body-parser";
import { adduser,submitEditUser,getRole,getUserParm,getTeam,getUserAll,getUsers, getUser , getTechHome , getuserHome , getadminHome} from "../controllers/usersController.js";
import {editProblemAdmin,getStatus,getDropdownWorker,getAllProblemLastest,getMyHistory,getLatestWorkAssignment,updateProblem ,cancelWorkAssignment,getProblemlist ,getProblemlastest, getMyWorkAssignment ,getMyWorkHistory, addProblem, checkSession, getCategory, getPriority, getDepartment,acceptWorkAssignment} from "../controllers/problemController.js";
import { changePassword, login , logout } from "../controllers/authController.js";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth , authGuard , sessionMiddleware , attachUser, redirectIfAuth ,requireRole} from "../middlewares/auth.js";


const router = express.Router();


const __dirname = dirname(fileURLToPath(import.meta.url));

// POST /api/users/register → สมัครสมาชิก
//router.post("/register", registerUser);

// GET /api/users → ดึงผู้ใช้ทั้งหมด
router.get("/getUser", getUsers);

router.get("/login", redirectIfAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html")); 
});



router.post("/login", login)
router.post("/login/changepassword" , requireAuth,changePassword);
router.post("/logout", logout);

router.get("/main/problemlist", requireAuth, (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/problemTable.html");
  return res.sendFile(filePath);
});

router.get("/main", requireAuth,(req, res) => {
  const filePath = path.join(__dirname, "../../public/page/home.html");
  if(req.user.rolename == "Admin") return res.redirect("/Admain");

  return res.sendFile(filePath);
});
router.get("/AdMain", requireAuth , (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/Adminhome.html");
  return res.sendFile(filePath);
});

router.get("/main/reportProblem", requireAuth,(req, res) => {
  const filePath = path.join(__dirname, "../../public/page/problemForm.html");
  return res.sendFile(filePath);
});

router.get("/main/myWorkAssignment",requireRole('Technician'), requireAuth , (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/myWorkAssignment.html");
  return res.sendFile(filePath);
});

router.get("/main/myWorkHistory", requireAuth , (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/myWorkHistory.html");
  return res.sendFile(filePath);
});

router.get("/main/myHistory", requireAuth , (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/myHistory.html");
  return res.sendFile(filePath);
});

router.get("/main/allUser", requireAuth , (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/userlist.html");
  return res.sendFile(filePath);
})

router.get("/editUser/:usersid",requireAuth,requireRole('Admin'), (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/adduserForm.html");
  return res.sendFile(filePath);
}) 

router.get("/main/adminadd", requireAuth,requireRole('Admin'), (req,res) => {
  const filePath = path.join(__dirname, "../../public/page/addUser.html");
    return res.sendFile(filePath);
});
router.get("/main/adminaction/data",requireAuth,requireRole('Admin'),getUserAll);
router.get("/main/users/data",requireAuth, getUser);

router.get("/userform/edit/:userid",requireAuth,getUserParm)

router.get("/getRole/data",requireAuth,requireRole('Admin'),getRole);

router.get("/main/problemlist/data", requireAuth, getProblemlist);
router.get("/main/myHistory/data",requireAuth,requireRole('User'), getMyHistory);
router.get("/main/myWorkHistory/data",requireAuth,requireRole('Technician'), getMyWorkHistory);
router.get("/main/myWorkAssignment/data",requireAuth,requireRole('Technician'), getMyWorkAssignment);

router.get("/main/problemlastest/data",requireAuth, getProblemlastest);
router.get("/main/allProblemLastest/data",requireAuth, getAllProblemLastest);


router.get("/api/check-session", requireAuth, checkSession);

// GET categories
router.get("/main/category",requireAuth,getCategory);

//GET departments
router.get("/main/department",requireAuth,getDepartment);

//GET priority
router.get("/main/priority" ,requireAuth,getPriority); 

// POST /api/add-problem
router.post("/add-problem", requireAuth, addProblem);
router.post("/add-user",requireAuth,requireRole('Admin'),adduser)
router.get("/main/status" ,requireAuth,getStatus); 


router.post("/main/problem/accept/:id", requireAuth,requireRole('Technician'),acceptWorkAssignment);
router.post("/main/problem/cancel/:id", requireAuth,requireRole('Technician'),cancelWorkAssignment);
router.post("/main/problem/update/:id", requireAuth,requireRole('Technician'),updateProblem);


router.get("/main/users/userCount/data",requireAuth,requireRole('User'),getuserHome);
router.get("/main/users/dashboard/data",requireAuth,requireRole('Admin'),getadminHome);
router.get("/main/users/TechCount/data",requireAuth,requireRole('Technician'), getTechHome);

router.get("/main/LatestWorkAssignment/data",requireAuth,requireRole('Technician'),getLatestWorkAssignment);


router.get("/main/assigned/:problemId",requireAuth,requireRole('Admin'),getDropdownWorker);

router.post("/main/problemList/update/:problemid",requireAuth,requireRole('Admin'),editProblemAdmin);

router.get("/getTeam/data",requireAuth,requireRole('Admin'),getTeam)

router.post("/submitEditUser",requireAuth,requireRole('Admin'),submitEditUser)
export default router;
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


router.get("/changepassword", requireAuth,(req,res) => {
  const filePath = path.join(__dirname, "../../public/page/newPassword.html");
  return res.sendFile(filePath);
})
router.post("/login", login)
router.post("/login/changepassword" , requireAuth,changePassword);
router.post("/logout", logout);

router.get("/main/problemlist", (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/problemTable.html");
  return res.sendFile(filePath);
});

router.get("/main",(req, res) => {
  const filePath = path.join(__dirname, "../../public/page/home.html");
  if(req.user.rolename == "Admin") return res.redirect("/Admain");

  return res.sendFile(filePath);
});
router.get("/AdMain" , (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/Adminhome.html");
  return res.sendFile(filePath);
});

router.get("/main/reportProblem",(req, res) => {
  const filePath = path.join(__dirname, "../../public/page/problemForm.html");
  return res.sendFile(filePath);
});

router.get("/main/myWorkAssignment",requireRole('Technician') , (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/myWorkAssignment.html");
  return res.sendFile(filePath);
});

router.get("/main/myWorkHistory", requireRole('Technician') , (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/myWorkHistory.html");
  return res.sendFile(filePath);
});

router.get("/main/myHistory", requireRole('User') , (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/myHistory.html");
  return res.sendFile(filePath);
});

router.get("/main/allUser", requireRole('Admin') , (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/userlist.html");
  return res.sendFile(filePath);
})

router.get("/editUser/:usersid",requireRole('Admin'), (req, res) => {
  const filePath = path.join(__dirname, "../../public/page/editUser.html");
  return res.sendFile(filePath);
}) 

router.get("/main/adminadd",requireRole('Admin'), (req,res) => {
  const filePath = path.join(__dirname, "../../public/page/addUser.html");
    return res.sendFile(filePath);
});
router.get("/main/adminaction/data",requireRole('Admin'),getUserAll);
router.get("/main/users/data", getUser);

router.get("/userform/edit/:userid",requireRole('Admin'),getUserParm)

router.get("/getRole/data",requireRole('Admin'),getRole);

router.get("/main/problemlist/data", getProblemlist);
router.get("/main/myHistory/data",requireRole('User'), getMyHistory);
router.get("/main/myWorkHistory/data",requireRole('Technician'), getMyWorkHistory);
router.get("/main/myWorkAssignment/data",requireRole('Technician'), getMyWorkAssignment);

router.get("/main/problemlastest/data",requireRole('User'), getProblemlastest);
router.get("/main/allProblemLastest/data",requireRole('Admin'), getAllProblemLastest);


router.get("/api/check-session", checkSession);

// GET categories
router.get("/main/category",getCategory);

//GET departments
router.get("/main/department",getDepartment);

//GET priority
router.get("/main/priority" ,getPriority); 

// POST /api/add-problem
router.post("/add-problem", addProblem);
router.post("/add-user",requireRole('Admin'),adduser)
router.get("/main/status" ,getStatus); 


router.post("/main/problem/accept/:id",requireRole('Technician'),acceptWorkAssignment);
router.post("/main/problem/cancel/:id",requireRole('Technician'),cancelWorkAssignment);
router.post("/main/problem/update/:id",requireRole('Technician'),updateProblem);


router.get("/main/users/userCount/data",requireRole('User'),getuserHome);
router.get("/main/users/dashboard/data",requireRole('Admin'),getadminHome);
router.get("/main/users/TechCount/data",requireRole('Technician'), getTechHome);

router.get("/main/LatestWorkAssignment/data",requireRole('Technician'),getLatestWorkAssignment);


router.get("/main/assigned/:problemId",requireRole('Admin'),getDropdownWorker);

router.post("/main/problemList/update/:problemid",requireRole('Admin'),editProblemAdmin);

router.get("/getTeam/data",requireRole('Admin'),getTeam)

router.post("/submitEditUser",requireRole('Admin'),submitEditUser)
export default router;
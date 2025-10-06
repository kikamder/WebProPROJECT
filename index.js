// server.mjs (หรือ index.mjs)
import express from "express";
import router from "./src/routes/userRoutes.js";
import { initMiddleware } from "./src/middlewares/middleware.js";


const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
initMiddleware(app); // เรียกใช้ middleware

app.use("/", (req,res) => {
  res.send("Hello World");
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
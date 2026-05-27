import loginController from "../controllers/authController.js";
import express from "express";


const loginRouter = express.Router();

loginRouter.post("/", loginController);

export default loginRouter ;
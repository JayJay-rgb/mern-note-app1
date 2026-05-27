import user from "../controllers/userController.js";
import express  from "express";
import verifyJWT from "../middleware/verifyJWT.js";

const meRouter = express.Router();
meRouter.use(verifyJWT);

meRouter.get("/",user);

export default meRouter;
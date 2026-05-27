import express from "express"
import refreshController from "../controllers/refreshController.js"

const refreshRouter= express.Router();
refreshRouter.get("/", refreshController)

export default refreshRouter
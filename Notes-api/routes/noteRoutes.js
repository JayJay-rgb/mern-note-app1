import express from "express";
import { getAllNotes,createNote,updateNote,deleteNote } from "../controllers/noteController.js";
import verifyJWT from "../middleware/verifyJWT.js";
const noteRouter = express.Router();
noteRouter.use(verifyJWT)
noteRouter.route("/notes")
    .get(getAllNotes)
    .post(createNote)


noteRouter.route("/notes/:id")
    .put(updateNote)
    .delete(deleteNote)

export default noteRouter;
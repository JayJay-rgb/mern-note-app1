import note from "../models/useSchema.js";
import mongoose from "mongoose";

export const getAllNotes = async (req,res)=>{
    try{
        const userId = new mongoose.Types.ObjectId(req.user);
        const notes = await note.find({user: userId});
        res.status(200).json(notes);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
};

export const createNote = async (req,res)=>{
    try{
        const userId = new mongoose.Types.ObjectId(req.user);
        const {title,content} = req.body;
        const findTitle = await note.findOne({title});
        if(findTitle) return res.status(400).json({"msg":"title already exist"});
        const newNote = new note({title, content, user: userId});
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    }
    catch(err){
        console.log(err);
        res.sendStatus(400);
    }
};

export const updateNote = async (req,res)=>{
    try{
        const userId = new mongoose.Types.ObjectId(req.user);
        const {id} = req.params;
        const {title,content} = req.body;
        const updatedNote = await note.findOneAndUpdate(
            {_id: id, user: userId},
            {title, content},
            {new: true}
        );
        res.status(200).json(updatedNote);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
};

export const deleteNote = async (req,res)=>{
    try{
        const userId = new mongoose.Types.ObjectId(req.user);
        const {id} = req.params;
        await note.findOneAndDelete({_id: id, user: userId});
        res.status(200).json({msg: "Note deleted"});
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
};
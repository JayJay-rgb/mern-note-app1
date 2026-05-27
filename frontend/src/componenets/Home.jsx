
import axios from "axios";
import React, { useEffect, useState } from "react";
import NoteModel from "./NoteModel";
import { useLocation } from "react-router-dom";

const Home = () => {
    const [notes,setNotes]= useState([]);
    const [error,setError]=useState("");
    const [isModelOpen,setIsModelOpen]= useState(false);
    const [editNote,setEditNote]=useState(null);
    const location = useLocation();
    
    

    const fetchNotes= async()=>{
        try{
            const token = localStorage.getItem("accessToken");
            if(!token){
                setError("No Authentication token found please login");
                return;
            }
            const searchParams = new URLSearchParams(location.search);
            const search= searchParams.get("search") || "";

            const {data} = await axios.get("/api/notes",{
                headers: {Authorization: `Bearer ${token}`}
                
            });
            const filteredNotes = search ? data.filter((note)=>note.title.toLowerCase().includes(search.toLowerCase())||
            note.content.toLowerCase().includes(search.toLowerCase())):data;
            setNotes(filteredNotes);
            // setNotes(data);
            
        }
        
        catch(err){
            setError("Failed to fetch notes");
        }

        
    }

    const handleEdit = (note)=>{
        setEditNote(note);
        setIsModelOpen(true);
    }

    useEffect(()=>{
            fetchNotes();
        },[location.search])

        const handleDel= async(id)=>{
            try{
                const token = localStorage.getItem("accessToken");
            if(!token){
                setError("No Authentication token found please login");
                return;
            }
            await axios.delete(`/api/notes/${id}`,{
                headers: {Authorization: `Bearer ${token}`}
            });
            setNotes(notes.filter((note)=>note._id!== id))
            }catch(err){
                setError("Failed to delete Note")
            }
        }

    const handleSaveNote = (newNote)=>{
        if(editNote){
            setNotes(notes.map((note)=> note._id === newNote._id ?newNote:note))
        }
        else{
            setNotes([...notes,newNote])
        }

        setEditNote(null)
        setIsModelOpen(false);
    }

    return <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-500
    ">{error && <p className="text-red-400 mb-4">{error}</p>}
        <NoteModel isOpen={isModelOpen} onClose={()=>{
            setIsModelOpen(false);
            setEditNote(null);
            
        }} 
        note={editNote}
        onSave={handleSaveNote}/>
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white 
        text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center" onClick={handleEdit}>
            <span className="flex items-center justify-center h-full
            w-full pb-1">+</span>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note)=>(
                <div className="bg-gray-800 p-6 rounded-lg shadow-md" key={note._id}>
                    <h3 className="text-lg font-medium text-white mb-2">{note.title}</h3>
                    <p className="text-gray-300 mb-4">{note.content}</p>
                    <p className="text-sm text-gray-400 mb-4">{new Date(note.createdAt).toLocaleString()}</p>
                    <div className="flex space-x-2">
                        <button className="bg-yellow-400 text-white px-3 py-1
                        rounded-md hover:bg-yellow-700" onClick={()=> handleEdit(note)}>Edit</button>
                        <button className="bg-red-600 text-white px-3 py-1
                        rounded-md hover:bg-red-700" onClick={() => handleDel(note._id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
}

export default Home;
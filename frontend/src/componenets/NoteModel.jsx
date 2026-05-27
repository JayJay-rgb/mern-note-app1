import axios from "axios";
import { useEffect, useState } from "react"


const NoteModel= ({isOpen,onClose,note,onSave})=>{
    const [title,setTitle]= useState("");
    const [content,setContent]= useState("");
    const [error,setError]= useState("");

    useEffect(()=>{
        setTitle(note?note.title: "");
        setContent(note?note.content:"");
        setError("");
    },[note])

    const handleSubmit= async(e)=>{
        e.preventDefault();
        try{
            const token = localStorage.getItem("accessToken");
            if(!token){
                setError("No Authentication token found please login");
                return;
            }

            const payload = { title,content}
            const config = {headers:{Authorization: `Bearer ${token}`}}
            if(note){
                const {data }= await axios.put(`/api/notes/${note._id}`,
                    payload,config
                    
                )
                onSave(data);
            } else{
                const {data} = await axios.post("/api/notes",payload,config);
                onSave(data);
            }
            setTitle("")
            setContent("")
            setError("");
            onClose();
        }catch(err){

                setError("Failed to save")
        }
    }

    if(!isOpen) return null;

    return(<div className="fixed inset-0 bg-black/30 flex
        items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md
            ">
                <h2 className="text-2xl text-white mb-4 font-semihold
            ">{note ? "Edit Note": "Create Note"}</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input type="text" value={title} onChange={(e)=>{
                        setTitle(e.target.value);
                    }}
                    placeholder="Notes title"
                    className="w-full px-3 py-2 bg-gray-700 text-white
                    border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500
                    "
                    required/>
                </div>
                <div>
                    <textarea type="text" value={content} onChange={(e)=>{
                        setContent(e.target.value);
                    }}
                    placeholder="Notes Content"
                    className="w-full px-3 py-2 bg-gray-700 text-white
                    border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500
                    "
                    rows={4}
                    required/>
                </div>
                <div className="flex space-x-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md
                    hover:bg-blue-700">{note?"Update": "Create"}</button>
                    <button type="button" className="bg-gray-600 text-white px-4 py-2 rounded-md
                    hover:bg-gray-700" onClick={onClose}>Cancel</button>
                    
                </div>
            </form>
            </div>
        </div>)
}

export default NoteModel
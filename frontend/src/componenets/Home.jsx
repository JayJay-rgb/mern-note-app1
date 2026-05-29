import axios from "axios";
import React, { useEffect, useState } from "react";
import NoteModel from "./NoteModel";
import { useLocation } from "react-router-dom";

const Home = ({ user }) => { // ✅ FIX: actually receive the user prop
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const location = useLocation();

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No authentication token found. Please login.");
        return;
      }

      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search") || "";

      const { data } = await axios.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredNotes = search
        ? data.filter(
            (note) =>
              note.title.toLowerCase().includes(search.toLowerCase()) ||
              note.content.toLowerCase().includes(search.toLowerCase())
          )
        : data;

      setNotes(filteredNotes);
    } catch (err) {
      // ✅ FIX: log the real error
      console.error("Fetch notes error:", err.response?.data || err.message);
      setError("Failed to fetch notes.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [location.search]);

  const handleEdit = (note) => {
    setEditNote(note);
    setIsModelOpen(true);
  };

  const handleDel = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No authentication token found. Please login.");
        return;
      }
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Delete note error:", err.response?.data || err.message);
      setError("Failed to delete note.");
    }
  };

  const handleSaveNote = (savedNote) => {
    if (editNote) {
      // Update existing note in list
      setNotes((prev) =>
        prev.map((note) => (note._id === savedNote._id ? savedNote : note))
      );
    } else {
      // Add new note to list
      setNotes((prev) => [...prev, savedNote]);
    }
    setEditNote(null);
    setIsModelOpen(false);
  };

  const handleCloseModal = () => {
    setIsModelOpen(false);
    setEditNote(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-500">
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* ✅ FIX: simpler key — just use note id or "new", no isModelOpen needed */}
      <NoteModel
        key={editNote?._id ?? "new"}
        isOpen={isModelOpen}
        onClose={handleCloseModal}
        note={editNote}
        onSave={handleSaveNote}
      />

      {/* Create Note button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center"
        onClick={() => {
          setEditNote(null);   // ✅ clear any previous edit
          setIsModelOpen(true);
        }}
      >
        <span className="flex items-center justify-center h-full w-full pb-1">+</span>
      </button>

      {/* Notes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.length === 0 && (
          <p className="text-gray-300 col-span-full text-center mt-10">
            No notes yet. Click + to create one!
          </p>
        )}
        {notes.map((note) => (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md" key={note._id}>
            <h3 className="text-lg font-medium text-white mb-2">{note.title}</h3>
            <p className="text-gray-300 mb-4">{note.content}</p>
            <p className="text-sm text-gray-400 mb-4">
              {new Date(note.createdAt).toLocaleString()}
            </p>
            <div className="flex space-x-2">
              <button
                className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-700"
                onClick={() => handleEdit(note)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                onClick={() => handleDel(note._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

import axios from "axios";
import { useEffect, useState } from "react";

const NoteModel = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset fields whenever the modal opens or the note changes
  useEffect(() => {
    if (isOpen) {
      setTitle(note ? note.title : "");
      setContent(note ? note.content : "");
      setError("");
    }
  }, [isOpen, note]); // ✅ FIX: depend on isOpen too so fields reset on every open

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No authentication token found. Please login.");
        setLoading(false);
        return;
      }

      const payload = { title, content };
      const config = { headers: { Authorization: `Bearer ${token}` } };

      let savedNote;
      if (note) {
        // Editing existing note
        const { data } = await axios.put(`/api/notes/${note._id}`, payload, config);
        savedNote = data;
      } else {
        // Creating new note
        const { data } = await axios.post("/api/notes", payload, config);
        savedNote = data;
      }

      onSave(savedNote); // ✅ pass saved note up to Home
      setTitle("");
      setContent("");
      setError("");
      onClose();
    } catch (err) {
      // ✅ FIX: log the real error so you can see what the server returns
      console.error("Save note error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Failed to save note. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl text-white mb-4 font-semibold">
          {note ? "Edit Note" : "Create Note"}
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Note content"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : note ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModel;

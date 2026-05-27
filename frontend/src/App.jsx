import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./componenets/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./componenets/Login";
import Register from "./componenets/Register";
import Home from "./componenets/Home";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setLoading(false);
            return;
        }
        const { data } = await axios.get("/api/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
      } catch(err) {
        console.log(err);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if(loading) return (
    <div className="min-h-screen bg-gray-500 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
    </div>
  );

  

  return (
    <div className="min-h-screen bg-gray-500">
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
        <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App;
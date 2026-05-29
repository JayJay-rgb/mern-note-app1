import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";


const Register= ({setUser}) => {
    const [userName,setUserName]= useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post("/api/register", { username: userName, email, password });
        
        // auto login after register
        const { data } = await axios.post("/api/login", { email, password });
        localStorage.setItem("accessToken", data.accessToken);
        const { data: userData } = await axios.get("/api/me", {
            headers: { Authorization: `Bearer ${data.accessToken}` }
        });
        setUser(userData);
        navigate("/");
    } catch(err) {
        console.log(err);
        setError(err.response?.data?.msg || "Server Error");
    }
}
    return(
        <div className="container mx-auto max-w-md mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input 
                        type="text" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Username"
                        className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                        required/>
                </div>
                <div>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                        required/>
                </div>
                <div>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                        required/>
                </div>
                <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700">
                    Register
                </button>
            </form>
            <p className="mt-4 text-center">
                Already have an account? 
                <Link className="text-blue-600 hover:underline" to="/login"> Sign in</Link>
            </p>
        </div>
    );
}

export default Register;
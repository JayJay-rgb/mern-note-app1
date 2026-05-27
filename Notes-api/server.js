import express from "express";
import cookieParser from "cookie-parser";
import noteRouter from "./routes/noteRoutes.js";
import "dotenv/config";
import mongoose from "mongoose";
import loginRouter from "./routes/login.js";
import registerRouter from "./routes/register.js"
import refreshRouter from "./routes/refresh.js";
import corsOption from "./config/cors.js";
import cors from "cors";
import meRouter from "./routes/me.js";
import path from "path"



const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));




const port = process.env.PORT;
mongoose.connect(process.env.MONGODB_URI)
                .then(()=>console.log("Connected to DB"))
                .catch((err)=>console.log(err))



app.use("/api/register",registerRouter);
app.use("/api/login",loginRouter);
app.use("/api/refresh",refreshRouter);
app.use("/api/me",meRouter);
app.use("/api",noteRouter);

const __dirname = path.resolve();

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"/frontend/dist")));
    app.get("/{*splat}",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
    })
}



mongoose.connection.once("open",()=>{
    console.log("MongoDB connected")
    app.listen(port,()=>console.log(`Running on http://localhost:${port}`) )
})
 
import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiError } from './src/utils/ApiError.js';


const app = express();

app.use(cors({
    origin: function(origin, callback) {
        
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.CORS_ORIGIN,
            'http://localhost:5173',
            'http://localhost:5174',
            'https://blogify-pzaq.vercel.app'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true 
}))

app.use(express.json())
app.use(express.urlencoded({extended: true , limit: "5mb"}))
app.use(express.static("public"))
app.use(cookieParser()) 



import routes from "./src/routes/index.routes.js";

app.use("/api/v1", routes);


// Global error handler
app.use((err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error
    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new ApiError(404, message);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ApiError(400, message);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ApiError(400, message);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
});


export {app}

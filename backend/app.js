import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./src/utils/ApiError.js";

const app = express();

/* ------------------- ✅ CORS ------------------- */
app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN,
      "http://localhost:5173",
      "http://localhost:5174",
      "https://blogify-pzaq.vercel.app",
    ],
    credentials: true,
  })
);

/* ------------------- ✅ Parsers ------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static("public"));
app.use(cookieParser());

/* ------------------- ✅ Routes ------------------- */
import routes from "./src/routes/index.routes.js";
app.use("/api/v1", routes);

/* ------------------- ✅ Global Error Handler ------------------- */
app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error("🔥 ERROR:", err);

  // Bad ObjectId
  if (err.name === "CastError") {
    error = new ApiError(404, "Resource not found");
  }

  // Duplicate key
  if (err.code === 11000) {
    error = new ApiError(400, "Duplicate field value entered");
  }

  // Validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((v) => v.message);
    error = new ApiError(400, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
});

export { app };

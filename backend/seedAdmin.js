import mongoose from "mongoose";
import { Admin } from "./src/models/admin.model.js";
import dotenv from "dotenv";
import { DB_NAME } from "./constant.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log("Connected to MongoDB");

    const existingAdmin = await Admin.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const admin = new Admin({
      email: "admin@example.com",
      password: "admin123", // Change this to a secure password
      name: "Administrator",
    });

    await admin.save();
    console.log("Admin created successfully");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();

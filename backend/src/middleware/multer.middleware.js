import multer from "multer";
import path from "path";

// Use memoryStorage to store the file as a buffer
const storage = multer.memoryStorage();

// Filter to allow only specific image file types and size
const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowed.includes(ext)) {
    // Reject the file
    return cb(new Error("Only image files (.jpg, .jpeg, .png) are allowed!"), false);
  }

  // Check file size: 100KB to 500KB
  const minSize = 100 * 1024; // 100KB
  const maxSize = 500 * 1024; // 500KB
  if (file.size < minSize || file.size > maxSize) {
    return cb(new Error("File size must be between 100KB and 500KB!"), false);
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 }, // 500KB limit
  fileFilter,
});


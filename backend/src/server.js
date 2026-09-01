import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notesRoutes from "./routes/note.route.js";
import { connectDB } from "./utils/connectDB.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config({ quiet: true });
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter); // global rate limiter

// Routes
app.use("/api/notes", notesRoutes);

// Listen to server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

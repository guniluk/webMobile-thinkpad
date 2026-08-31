import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notesRoutes from "./routes/note.route.js";
import { connectDB } from "./utils/connectDB.js";

dotenv.config({ quiet: true });
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notes", notesRoutes);

// Listen to server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

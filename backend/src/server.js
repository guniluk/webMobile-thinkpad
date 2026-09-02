import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import notesRoutes from "./routes/note.route.js";
import { connectDB } from "./utils/connectDB.js";
import { startKeepAlive } from "./utils/cron.js";
import rateLimiter from "./middleware/rateLimiter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// Middlewares
if (!isProduction) {
  // 로컬 개발 환경: Vite dev server 등에서의 CORS 요청 허용
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
      ],
      credentials: true,
    }),
  );
} else {
  // Render 배포 환경: 동일 도메인 및 외부 요청 대응
  app.use(cors());
}

app.use(express.json());

// API Routes (Rate Limiter는 정적 파일이 아닌 API 요청에만 적용)
app.use("/api/notes", rateLimiter, notesRoutes);

// Health check endpoint (Render 헬스 체크용)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Production environment: Serve frontend static build files (Render 배포 환경)
if (isProduction) {
  const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDistPath));

  // SPA fallback: 모든 비-API 라우트를 frontend/dist/index.html로 라우팅 (Express 5 문법 대응)
  app.get("{*splat}", (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, "index.html"));
  });
} else {
  // Development environment: API 안내 메시지 제공
  app.get("/", (req, res) => {
    res.json({
      message: "ThinkPad API Server is running in development mode.",
      api: "/api/notes",
      health: "/api/health",
    });
  });
}

// Server Startup
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT} [Mode: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}]`,
      );
      // Render 비활성 슬립 방지용 14분 자동 헬스체크 서비스 (production 모드일 때만 동작)
      if (isProduction) {
        startKeepAlive();
      }
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

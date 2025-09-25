import express from "express";
import morgan from "morgan";
import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import type { Request, Response } from "express"; // 👈 เพิ่มบรรทัดนี้

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v2/students", studentRoutes);
app.use("/api/v2/courses", courseRoutes);

// My Information
app.get("/me", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Student Information",
    data: {
      studentId: "670612132",
      firstName: "Suphaserd",
      lastName: "Chailangka",
      program: "CPE",
      section: "801",
    },
  });
});

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);

export default app;

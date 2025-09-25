import express, { type Request, type Response } from "express";
import morgan from "morgan";
import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "lab 15 API service successfully",
  });
});

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

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

export default app;

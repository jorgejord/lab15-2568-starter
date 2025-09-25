import { Router, Request, Response } from "express";
import { students, courses } from "../db/db.js";
import { zStudentId } from "../schemas/studentValidator.js";

const router = Router();

router.get("/:studentId/courses", (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const parseResult = zStudentId.safeParse(studentId);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.issues.map(e => e.message),
      });
    }

    const student = students.find(s => s.studentId === studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student does not exist" });
    }

    const studentCourses = student.courses?.map(cid => {
      const course = courses.find(c => c.courseId === cid);
      return {
        courseId: cid,
        courseTitle: course ? course.courseTitle : "Unknown",
      };
    }) || [];

    return res.status(200).json({
      success: true,
      message: `Get courses detail of student ${studentId}`,
      data: {
        studentId,
        courses: studentCourses,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong", error: err });
  }
});

export default router;

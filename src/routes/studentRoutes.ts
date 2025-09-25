import { Router, type Request, type Response } from "express";
import { students, courses } from "../db/db.js";
import { zStudentId } from "../schemas/studentValidator.js";

const router = Router();

router.get("/:studentId/courses", (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const result_validate = zStudentId.safeParse(studentId);

    if (!result_validate.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: result_validate.error.issues[0]?.message,
      });
    }

    const foundIndex = students.findIndex(s => s.studentId === studentId);
    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Student does not exist",
      });
    }

    res.set("Link", `/students/${studentId}/courses`);

    let courses_filter: { courseId: number; courseTitle: string }[] = [];
    const studentCourses = students[foundIndex].courses;
    if (studentCourses && studentCourses.length > 0) {
      courses_filter = courses
        .filter(c => studentCourses.includes(c.courseId))
        .map(c => ({ courseId: c.courseId, courseTitle: c.courseTitle }));
    }

    return res.status(200).json({
      success: true,
      message: `Get courses detail of student ${studentId}`,
      data: {
        studentId,
        courses: courses_filter,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

export default router;

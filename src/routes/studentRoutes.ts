import { Router } from "express";
import { students, courses } from "../db/db.js";

const router = Router();

router.get("/:studentId/courses", (req, res) => {
    const { studentId } = req.params;

    const student = students.find((s) => s.studentId === studentId);

    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }

    if (!student.courses || student.courses.length === 0) {
        return res.json({
            success: true,
        message: `Student ${studentId} has no registered courses`,
        data: {
        studentId: student.studentId,
        courses: [],
        },
    });
}

    const studentCourses = student.courses.map((cid) => {
        const course = courses.find((c) => c.courseId === cid);
        return {
        courseId: cid,
        courseTitle: course ? course.courseTitle : "Unknown",
        };
    });


        res.json({
        success: true,
        message: `Get courses detail of student ${studentId}`,
        data: {
        studentId: student.studentId,
        courses: studentCourses,
        },
    });
});

export default router;

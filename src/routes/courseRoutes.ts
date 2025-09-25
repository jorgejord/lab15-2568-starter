import { Router } from "express";
import { courses } from "../db/db.js";
import {
    zCoursePostBody,
    zCoursePutBody,
    zCourseDeleteBody,
} from "../schemas/courseValidator.js";
import { z } from "zod";

const router = Router();

const zCourseIdParam = z.object({
    courseId: z
        .string()
        .regex(/^\d+$/, { message: "Invalid input: expected number" })
        .transform((val) => Number(val)),
});

// READ all
router.get("/:courseId", (req, res) => {
    const parseResult = zCourseIdParam.safeParse(req.params);

    if (!parseResult.success) {
        return res.status(400).json({
        message: "Validation failed",
        errors: parseResult.error.errors.map((e) => e.message),
        });
    }

    const { courseId } = parseResult.data;
    const course = courses.find((c) => c.courseId === courseId);

    if (!course) {
        return res.status(404).json({
        success: false,
        message: "Course does not exists",
        });
    }

    res.json({
        success: true,
        message: `Get course ${courseId} successfully`,
        data: course,
    });
});

router.post("/", (req, res) => {
    const parseResult = zCoursePostBody.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({
        message: "Validation failed",
        errors: parseResult.error.errors.map((e) => e.message),
        });
    }

    const newCourse = parseResult.data;
    const exists = courses.find((c) => c.courseId === newCourse.courseId);

    if (exists) {
        return res.status(409).json({
        success: false,
        message: "Course Id already exists",
        });
    }

    courses.push(newCourse);

    res.status(201).json({
        success: true,
        message: `Course ${newCourse.courseId} has been added successfully`,
        data: newCourse,
    });
});

router.put("/", (req, res) => {
    const parseResult = zCoursePutBody.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.errors.map((e) => e.message),
        });
    }

    const updateData = parseResult.data;
    const course = courses.find((c) => c.courseId === updateData.courseId);

    if (!course) {
        return res.status(404).json({
        success: false,
        message: "Course Id does not exists",
        });
    }

    if (updateData.courseTitle) course.courseTitle = updateData.courseTitle;
    if (updateData.instructors) course.instructors = updateData.instructors;

    res.json({
        success: true,
        message: `Course ${course.courseId} has been updated successfully`,
        data: course,
    });
});

router.delete("/", (req, res) => {
    const parseResult = zCourseDeleteBody.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.errors.map((e) => e.message),
        });
    }

    const { courseId } = parseResult.data;
    const index = courses.findIndex((c) => c.courseId === courseId);

    if (index === -1) {
        return res.status(404).json({
        success: false,
        message: "Course Id does not exists",
        });
    }

    const deletedCourse = courses.splice(index, 1)[0];

    res.json({
        success: true,
        message: `Course ${deletedCourse.courseId} has been deleted successfully`,
        data: deletedCourse,
    });
});

export default router;

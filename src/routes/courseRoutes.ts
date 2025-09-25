import express from "express";
import { courses } from "../db/db.js";
import {
  zCoursePostBody,
  zCoursePutBody,
  zCourseDeleteBody,
  zCourseId,
} from "../schemas/courseValidator.js";
import type { Request, Response } from "express"; // 👈 เพิ่มตรงนี้

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Successfully fetched all courses",
      data: courses,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong", error: err });
  }
});

router.get("/:courseId", (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.courseId);
    const parseResult = zCourseId.safeParse(courseId);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.issues.map((e) => e.message),
      });
    }

    const course = courses.find((c) => c.courseId === courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course does not exist" });
    }

    return res.status(200).json({
      success: true,
      message: `Get course ${courseId} successfully`,
      data: course,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong", error: err });
  }
});

router.post("/", (req: Request, res: Response) => {
  try {
    const parseResult = zCoursePostBody.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.issues.map((e) => e.message),
      });
    }

    const newCourse = parseResult.data;
    const exists = courses.find((c) => c.courseId === newCourse.courseId);
    if (exists) {
      return res.status(409).json({ success: false, message: "Course Id already exists" });
    }

    courses.push(newCourse);

    return res.status(201).json({
      success: true,
      message: `Course ${newCourse.courseId} has been added successfully`,
      data: newCourse,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong", error: err });
  }
});

router.put("/", (req: Request, res: Response) => {
  try {
    const parseResult = zCoursePutBody.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.issues.map((e) => e.message),
      });
    }

    const updateData = parseResult.data;
    const course = courses.find((c) => c.courseId === updateData.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course Id does not exist" });
    }

    if (updateData.courseTitle) course.courseTitle = updateData.courseTitle;
    if (updateData.instructors) course.instructors = updateData.instructors;

    return res.status(200).json({
      success: true,
      message: `Course ${course.courseId} has been updated successfully`,
      data: course,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong", error: err });
  }
});

router.delete("/", (req: Request, res: Response) => {
  try {
    const parseResult = zCourseDeleteBody.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parseResult.error.issues.map((e) => e.message),
      });
    }

    const { courseId } = parseResult.data;
    const index = courses.findIndex((c) => c.courseId === courseId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Course Id does not exist" });
    }

    const deletedCourse = courses.splice(index, 1)[0];

    return res.status(200).json({
      success: true,
      message: `Course ${deletedCourse?.courseId} has been deleted successfully`,
      data: deletedCourse,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something went wrong", error: err });
  }
});

export default router;

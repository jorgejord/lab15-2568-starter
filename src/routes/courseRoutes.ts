import { Router, type Request, type Response } from "express";
import { courses } from "../db/db.js";
import {
  zCoursePostBody,
  zCoursePutBody,
  zCourseDeleteBody,
  zCourseId,
} from "../schemas/courseValidator.js";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Successfully",
      data: courses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

router.get("/:courseId", (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.courseId);
    const result_validate = zCourseId.safeParse(courseId);

    if (!result_validate.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: result_validate.error.issues[0]?.message,
      });
    }

    const foundIndex = courses.findIndex(c => c.courseId === courseId);
    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Course does not exist",
      });
    }

    res.set("Link", `/courses/${courseId}`);
    return res.status(200).json({
      success: true,
      message: `Get course ${courseId} successfully`,
      data: courses[foundIndex],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

router.post("/", (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parseResult = zCoursePostBody.safeParse(body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: parseResult.error.issues[0]?.message,
      });
    }

    const exists = courses.find(c => c.courseId === body.courseId);
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Course Id already exists",
      });
    }

    courses.push(body);
    res.set("Link", `/courses/${body.courseId}`);

    return res.status(201).json({
      success: true,
      message: `Course ${body.courseId} has been added successfully`,
      data: body,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

router.put("/", (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parseResult = zCoursePutBody.safeParse(body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: parseResult.error.issues[0]?.message,
      });
    }

    const foundIndex = courses.findIndex(c => c.courseId === body.courseId);
    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id does not exist",
      });
    }

    courses[foundIndex] = { ...courses[foundIndex], ...body };
    res.set("Link", `/courses/${body.courseId}`);

    return res.status(200).json({
      success: true,
      message: `Course ${body.courseId} has been updated successfully`,
      data: courses[foundIndex],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

router.delete("/", (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parseResult = zCourseDeleteBody.safeParse(body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: parseResult.error.issues[0]?.message,
      });
    }

    const foundIndex = courses.findIndex(c => c.courseId === body.courseId);
    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Course Id does not exist",
      });
    }

    courses.splice(foundIndex, 1);

    return res.status(200).json({
      success: true,
      message: `Course ${body.courseId} has been deleted successfully`,
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

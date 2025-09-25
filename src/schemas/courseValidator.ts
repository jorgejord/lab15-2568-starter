import { z } from "zod";

const zCourseId = z.number().int().refine((val) => val >= 100000 && val <= 999999, {
  message: "Number must be exactly 6 digits",
});
const zCourseTitle = z.string();
const zInstructors = z.array(z.string());

export const zCoursePostBody = z.object({
  courseId: zCourseId,
  courseTitle: zCourseTitle,
  instructors: zInstructors,
});

export const zCoursePutBody = z.object({
  courseId: zCourseId,
  courseTitle: zCourseTitle.nullish(),
  instructors: zInstructors.nullish(),
});

export const zCourseDeleteBody = z.object({
  courseId: zCourseId,
});

export { zCourseId };

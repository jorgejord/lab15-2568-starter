import { z } from "zod";

const zStudentId = z
  .string()
  .length(9, { message: "Student Id must contain 9 characters" });
const zFirstName = z
  .string()
  .min(3, { message: "First name requires at least 3 charaters" });
const zLastName = z
  .string()
  .min(3, { message: "Last name requires at least 3 characters" });
const zProgram = z.enum(["CPE", "ISNE"], {
  message: "Program must be either CPE or ISNE",
});
const zCourse = z.array(z.number());

export const zStudentPostBody = z.object({
  studentId: zStudentId,
  firstName: zFirstName,
  lastName: zLastName,
  program: zProgram,
  courses: zCourse.nullish(),
});

export const zStudentPutBody = z.object({
  studentId: zStudentId,
  firstName: zFirstName.nullish(),
  lastName: zLastName.nullish(),
  program: zProgram.nullish(),
});

export const zStudentDeleteBody = z.object({
  studentId: zStudentId,
});

export { zStudentId };

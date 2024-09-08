import { z } from "zod";

export const signInFormSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is not valid" }),
  password: z.string({ required_error: "Password is required" }),
});

export const userFormSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(8, { message: "Password harus terdiri dari minimal 8 karakter" }),
  nip: z
    .string({ required_error: "NIP wajib diisi" })
    .refine((value) => value.toString().length === 18, {
      message: "NIP harus terdiri dari 18 digit",
    }),
  name: z
    .string({ required_error: "Nama wajib diisi" })
    .min(3, { message: "Nama harus terdiri dari minimal 3 karakter" }),
  role: z.enum(["ADMIN", "USER"], {
    required_error: "Peran (role) wajib diisi",
  }),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Jenis kelamin wajib diisi",
  }),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    required_error: "Status wajib diisi",
  }),
  id_team: z.string({ required_error: "ID Tim wajib diisi" }),
});

export const teamFormSchema = z.object({
  name: z
    .string({ required_error: "Nama Tim Wajib Di Isi" })
    .min(4, { message: "Nama Tim minimal 4 Karakter" }),
});

export const evaluationSheetSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  date_start: z.date({ required_error: "Start date is required" }),
  date_finish: z.date({ required_error: "Finish date is required" }),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"], {
    required_error: "Status is required",
  }),
  year: z.string({ required_error: "Year is required" }),
});

export const componentSchema = z.object({
  name: z.string({ required_error: "Component name is required" }),
  description: z.string().optional(),
  weight: z.number({ required_error: "Weight is required" }),
  id_team: z.number({ required_error: "Team ID is required" }),
  id_LKE: z.number({ required_error: "Evaluation Sheet ID is required" }),
});

export const subComponentSchema = z.object({
  name: z.string({ required_error: "Sub-component name is required" }),
  description: z.string().optional(),
  weight: z.number({ required_error: "Weight is required" }),
  id_components: z.number({ required_error: "Component ID is required" }),
});

export const criteriaSchema = z.object({
  name: z.string({ required_error: "Criteria name is required" }),
  description: z.string().optional(),
  id_subcomponents: z.number({
    required_error: "Sub-component ID is required",
  }),
});

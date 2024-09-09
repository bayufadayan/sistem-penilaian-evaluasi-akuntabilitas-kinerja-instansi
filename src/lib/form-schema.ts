import { z } from "zod";

export const signInFormSchema = z.object({
  email: z
    .string({ required_error: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(8, { message: "Password harus terdiri dari minimal 8 karakter" }),
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
    .string({ required_error: "Nama tim wajib diisi" })
    .min(4, { message: "Nama tim harus minimal 4 karakter" }),
});

export const evaluationSheetSchema = z.object({
  title: z.string({ required_error: "Judul wajib diisi" }),
  date_start: z.date({ required_error: "Tanggal mulai wajib diisi" }),
  date_finish: z.date({ required_error: "Tanggal selesai wajib diisi" }),
  description: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"], {
    required_error: "Status wajib diisi",
  }),
  year: z.string({ required_error: "Tahun wajib diisi" }),
});

export const componentSchema = z.object({
  name: z.string({ required_error: "Nama komponen wajib diisi" }),
  description: z.string().optional(),
  weight: z.number({ required_error: "Bobot wajib diisi" }),
  id_team: z.number({ required_error: "ID Tim wajib diisi" }),
  id_LKE: z.number({ required_error: "ID Lembar Evaluasi wajib diisi" }),
});

export const subComponentSchema = z.object({
  name: z.string({ required_error: "Nama sub-komponen wajib diisi" }),
  description: z.string().optional(),
  weight: z.number({ required_error: "Bobot wajib diisi" }),
  id_components: z.number({ required_error: "ID Komponen wajib diisi" }),
});

export const criteriaSchema = z.object({
  name: z.string({ required_error: "Nama kriteria wajib diisi" }),
  description: z.string().optional(),
  id_subcomponents: z.number({
    required_error: "ID Sub-komponen wajib diisi",
  }),
});

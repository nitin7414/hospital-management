import { z } from "zod";

export const patientRegistrationSchema = z.object({
  email: z.string().email("Valid email is required."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be 72 characters or fewer."),
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().int().min(0, "Age must be valid.").max(130, "Age must be valid."),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  medicalHistory: z.string().min(5, "Medical history is required."),
});

export type PatientRegistrationInput = z.infer<typeof patientRegistrationSchema>;

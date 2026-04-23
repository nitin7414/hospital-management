"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { patientRegistrationSchema } from "@/lib/validations/patient";

export type CreatePatientState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createPatientAction(
  _prevState: CreatePatientState,
  formData: FormData,
): Promise<CreatePatientState> {
  await requireAdmin();

  const parsed = patientRegistrationSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    age: formData.get("age"),
    gender: formData.get("gender"),
    medicalHistory: formData.get("medicalHistory"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email is already registered.",
      };
    }

    const hashedPassword = await hash(parsed.data.password, 12);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: parsed.data.email,
          password: hashedPassword,
          role: "PATIENT",
        },
      });

      await tx.patientProfile.create({
        data: {
          userId: user.id,
          name: parsed.data.name,
          age: parsed.data.age,
          gender: parsed.data.gender,
          medicalHistory: parsed.data.medicalHistory,
        },
      });
    });

    revalidatePath("/admin/patients");
    return { success: true, message: "Patient registered successfully." };
  } catch (error) {
    console.error("Create patient error:", error);
    return { success: false, message: "Failed to register patient." };
  }
}

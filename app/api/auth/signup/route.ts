import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const signupSchema = z.object({
  email: z.string().trim().email("Valid email is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  // Role is optional at signup; defaults to PATIENT for safer onboarding.
  role: z
    .preprocess(
      (value) => (typeof value === "string" ? value.toUpperCase().trim() : value),
      z.enum(["ADMIN", "DOCTOR", "PATIENT"]),
    )
    .optional()
    .default("PATIENT"),
});

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      const firstIssue = result.error.issues[0]?.message ?? "Invalid payload.";
      return NextResponse.json(
        { message: firstIssue, errors: result.error.flatten() },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email: result.data.email } });

    if (existingUser) {
      return NextResponse.json({ message: "Email is already in use." }, { status: 409 });
    }

    const hashedPassword = await hash(result.data.password, 12);

    await prisma.user.create({
      data: {
        email: result.data.email,
        password: hashedPassword,
        role: result.data.role,
      },
    });

    return NextResponse.json({ message: "Account created successfully." }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

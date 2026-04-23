import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["ADMIN", "DOCTOR", "PATIENT"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid payload.", errors: result.error.flatten() },
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

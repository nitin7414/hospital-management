import { NextResponse } from "next/server";

import { sendEmail } from "@/lib/notifications/email";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!process.env.REMINDER_CRON_SECRET || token !== process.env.REMINDER_CRON_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const appointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: now,
        lte: next24Hours,
      },
      reminderSent: false,
    },
    include: {
      patient: {
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  for (const appointment of appointments) {
    await sendEmail({
      to: appointment.patient.user.email,
      subject: "Appointment Reminder",
      text: `Reminder: You have an appointment on ${appointment.date.toLocaleString()}.`,
    });

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { reminderSent: true },
    });
  }

  return NextResponse.json({ sent: appointments.length });
}

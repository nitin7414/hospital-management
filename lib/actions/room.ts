"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { createRoomSchema, updateRoomSchema } from "@/lib/validations/room";

export type RoomActionState = {
  success: boolean;
  message: string;
};

export async function createRoomAction(
  _prevState: RoomActionState,
  formData: FormData,
): Promise<RoomActionState> {
  await requireAdmin();

  const parsed = createRoomSchema.safeParse({
    type: formData.get("type"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid room data.",
    };
  }

  try {
    await prisma.room.create({
      data: {
        type: parsed.data.type,
        status: "VACANT",
      },
    });

    revalidatePath("/admin/rooms");
    return { success: true, message: "Room added successfully." };
  } catch (error) {
    console.error("Create room error:", error);
    return { success: false, message: "Failed to add room." };
  }
}

export async function updateRoomAction(
  _prevState: RoomActionState,
  formData: FormData,
): Promise<RoomActionState> {
  await requireAdmin();

  const parsed = updateRoomSchema.safeParse({
    roomId: formData.get("roomId"),
    status: formData.get("status"),
    patientId: formData.get("patientId"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid update data.",
    };
  }

  const patientId = parsed.data.patientId || null;

  if (parsed.data.status === "OCCUPIED" && !patientId) {
    return {
      success: false,
      message: "Select a patient when room is occupied.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (patientId) {
        await tx.room.updateMany({
          where: {
            patientId,
            NOT: { id: parsed.data.roomId },
          },
          data: {
            patientId: null,
            status: "VACANT",
          },
        });
      }

      await tx.room.update({
        where: { id: parsed.data.roomId },
        data: {
          status: parsed.data.status,
          patientId: parsed.data.status === "VACANT" ? null : patientId,
        },
      });
    });

    revalidatePath("/admin/rooms");
    return { success: true, message: "Room updated successfully." };
  } catch (error) {
    console.error("Update room error:", error);
    return { success: false, message: "Failed to update room." };
  }
}

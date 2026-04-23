import { z } from "zod";

export const createRoomSchema = z.object({
  type: z.enum(["ICU", "GENERAL"]),
});

export const updateRoomSchema = z.object({
  roomId: z.string().uuid("Invalid room ID."),
  status: z.enum(["OCCUPIED", "VACANT"]),
  patientId: z.string().uuid("Invalid patient selected.").optional().or(z.literal("")),
});

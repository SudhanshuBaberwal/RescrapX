import { z } from "zod";

export const createAuctionSchema = z
  .object({
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    autoExtend: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    // Start time must be in the future
    if (data.startTime <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Start time must be in the future.",
      });
    }
    if (data.endTime <= data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after start time.",
      });
    }
  });

export type CreateAuctionDto = z.infer<typeof createAuctionSchema>;
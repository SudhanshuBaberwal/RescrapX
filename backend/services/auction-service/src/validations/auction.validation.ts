import { z } from "zod";

export const createAuctionSchema = z
  .object({
    minimumBid: z.number().positive(),
    reservePrice: z.number().positive(),
    bidIncrement: z
      .number()
      .min(100)
      .default(1000),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    autoExtend: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.reservePrice < data.minimumBid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reservePrice"],
        message:
          "Reserve price must be greater than or equal to minimum bid.",
      });
    }
    if (data.endTime <= data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after start time.",
      });
    }
    if (data.startTime <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Start time must be in the future.",
      });
    }
  });

export type CreateAuctionDto =
  z.infer<typeof createAuctionSchema>;
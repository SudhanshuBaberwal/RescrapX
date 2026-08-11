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

export const configureAuctionVehicleSchema = z
  .object({
    vehicleId: z.string().min(1, "Vehicle ID is required"),

    minimumBid: z.number().positive("Minimum bid must be greater than 0"),

    reservePrice: z.number().positive("Reserve price must be greater than 0"),

    bidIncrement: z.number().positive("Bid increment must be greater than 0"),
  })
  .superRefine((data, ctx) => {
    if (data.reservePrice < data.minimumBid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reservePrice"],
        message: "Reserve price must be greater than or equal to minimum bid.",
      });
    }
  });

export type ConfigureAuctionVehicleDto = z.infer<
  typeof configureAuctionVehicleSchema
>;

export type CreateAuctionDto = z.infer<typeof createAuctionSchema>;

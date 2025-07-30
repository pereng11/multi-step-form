import { z } from "zod";

export const ratingSchema = z.union([
  z.literal(0),
  z.literal(0.5),
  z.literal(1),
  z.literal(1.5),
  z.literal(2),
  z.literal(2.5),
  z.literal(3),
  z.literal(3.5),
  z.literal(4),
  z.literal(4.5),
  z.literal(5),
]);

export type Rating = z.infer<typeof ratingSchema>;

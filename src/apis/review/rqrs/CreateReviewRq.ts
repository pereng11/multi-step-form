import { z } from "zod";
import { quoteSchema } from "../vo/quote";
import { ratingSchema } from "../vo/rating";
import { ReadingStatus } from "../vo/readingStatus";

export const createReviewRqSchema = z.object({
  status: z.enum(ReadingStatus),
  startDate: z.iso.date().nullable(),
  endDate: z.iso.date().nullable(),
  recommend: z.boolean(),
  rating: ratingSchema,
  report: z.string().nullable(),
  quotes: z.array(quoteSchema),
  isPublic: z.boolean(),
});
export type CreateReviewRq = z.infer<typeof createReviewRqSchema>;

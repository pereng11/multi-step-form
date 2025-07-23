import * as z from "zod";

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  page: z.number(),
  publishedAt: z.iso.date(),
});

export type Book = z.infer<typeof bookSchema>;

import { z } from "zod";

export const quoteSchema = z.object({
  quote: z
    .string()
    .min(1, { message: "인용구를 입력해주세요." })
    .max(500, { message: "인용구는 500자 이하여야 합니다." }),
  page: z.number().optional(),
});

export type Quote = z.infer<typeof quoteSchema>;

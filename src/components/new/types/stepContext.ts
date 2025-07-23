import { toTruthy } from "@/utils/ArrayUtil";
import { optionalInput } from "@/utils/TypeUtil";
import * as z from "zod";
import { ratingSchema } from "./rating";
import { ReadingStatus } from "./readingStatus";

export const basicStepSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    page: z.number(),
    publishedAt: z.iso.date(),
    status: optionalInput(z.enum(ReadingStatus)),
    startDate: optionalInput(z.iso.date().nullable()),
    endDate: optionalInput(z.iso.date().nullable()),
  })
  .check(({ value, issues }) => {
    if (value.status !== ReadingStatus.WISH && value.startDate !== null) {
      if (!z.date().min(new Date(value.publishedAt)).safeParse(value.startDate).success) {
        issues.push({
          code: "custom",
          input: value,
          message: "시작일은 출판일 이후여야 합니다.",
          path: ["startDate"],
        });
      }
    }

    switch (value.status) {
      case ReadingStatus.WISH:
        if (value.startDate !== null || value.endDate !== null) {
          issues.push({
            code: "custom",
            input: value,
            message: "읽고 싶은 책에는 독서 기간을 설정할 수 없습니다.",
            path: toTruthy([value.startDate !== null ? "startDate" : null, value.endDate !== null ? "endDate" : null]),
          });
        }
        break;
      case ReadingStatus.READING:
        if (value.startDate === null) {
          issues.push({
            code: "custom",
            input: value,
            message: "읽고 있는 책에는 시작일을 설정해야 합니다.",
            path: ["startDate"],
          });
        }
        if (value.endDate !== null) {
          issues.push({
            code: "custom",
            input: value,
            message: "읽고 있는 책에는 종료일을 설정할 수 없습니다.",
            path: ["endDate"],
          });
        }
        break;
      case ReadingStatus.PENDING:
        if (value.startDate === null) {
          issues.push({
            code: "custom",
            input: value,
            message: "보류 중인 책에는 시작일을 설정해야 합니다.",
            path: ["startDate"],
          });
        }
        if (value.endDate !== null) {
          issues.push({
            code: "custom",
            input: value,
            message: "보류 중인 책에는 종료일을 설정할 수 없습니다.",
            path: ["endDate"],
          });
        }
        break;
      case ReadingStatus.FINISHED:
        if (value.startDate === null || value.endDate === null) {
          issues.push({
            code: "custom",
            input: value,
            message: "완료된 책에는 시작일과 완료일을 설정해야 합니다.",
            path: toTruthy([value.startDate === null ? "startDate" : null, value.endDate === null ? "endDate" : null]),
          });
        }
        break;
    }
  });

export type BasicStepContext = z.input<typeof basicStepSchema>;

export const recommandStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  page: z.number(),
  publishedAt: z.iso.date(),
  status: z.enum(ReadingStatus),
  startDate: z.iso.date().nullable(),
  endDate: z.iso.date().nullable(),
  recommand: optionalInput(z.boolean()),
  rating: optionalInput(ratingSchema),
});

export type RecommandStepContext = z.input<typeof recommandStepSchema>;

import { Book } from "@/types/book";
import { toTruthy } from "@/utils/ArrayUtil";
import { optionalInput } from "@/utils/TypeUtil";
import * as z from "zod";
import { ratingSchema } from "./rating";
import { ReadingStatus } from "./readingStatus";

export type BookReviewFunnelContext = {
  step1: BasicStepContext;
  step2: RecommandStepContext;
  step3: BookReportStepContext;
};

export const createBasicStepSchema = (book: Book) => {
  return z
    .object({
      status: optionalInput(z.enum(ReadingStatus)),
      startDate: optionalInput(z.iso.date().nullable()),
      endDate: optionalInput(z.iso.date().nullable()),
    })
    .check(({ value, issues }) => {
      if (value.status !== ReadingStatus.WISH && value.startDate !== null) {
        if (!z.date().min(new Date(book.publishedAt)).safeParse(value.startDate).success) {
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
              path: toTruthy([
                value.startDate !== null ? "startDate" : null,
                value.endDate !== null ? "endDate" : null,
              ]),
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
              path: toTruthy([
                value.startDate === null ? "startDate" : null,
                value.endDate === null ? "endDate" : null,
              ]),
            });
          }
          break;
      }
    });
};

export type BasicStepContext = z.input<ReturnType<typeof createBasicStepSchema>>;

export const recommandStepSchema = z.object({
  status: z.enum(ReadingStatus),
  startDate: z.iso.date().nullable(),
  endDate: z.iso.date().nullable(),
  recommand: optionalInput(z.boolean()),
  rating: optionalInput(ratingSchema),
});

export type RecommandStepContext = z.input<typeof recommandStepSchema>;

export const bookReportStepSchema = z
  .object({
    status: z.enum(ReadingStatus),
    startDate: z.iso.date().nullable(),
    endDate: z.iso.date().nullable(),
    recommand: z.boolean(),
    rating: ratingSchema,
    report: optionalInput(z.string().nullable()),
  })
  .check(({ value, issues }) => {
    const needReport = value.rating <= 1 || value.rating === 5;
    const isReportValid = !needReport || z.string().min(100).safeParse(value.report).success;
    if (!isReportValid) {
      issues.push({
        code: "custom",
        input: value,
        message: "평점이 1점 이하 또는 5점인 경우 리뷰를 작성해야 합니다.",
        path: ["report"],
      });
    }
  });

export type BookReportStepContext = z.input<typeof bookReportStepSchema>;

import { Book } from "@/types/book";
import { isNotNil, optionalInput } from "@/utils/TypeUtil";
import * as z from "zod";
import { ratingSchema } from "./rating";
import { ReadingStatus } from "./readingStatus";

export type BookReviewFunnelContext = {
  step1: BasicStepContext;
  step2: RecommandStepContext;
  step3: BookReportStepContext;
  step4: QuoteStepContext;
};

export const createBasicStepSchema = (book: Book) => {
  return z
    .object({
      status: optionalInput(z.enum(ReadingStatus, { message: "독서 상태를 선택해주세요." })),
      startDate: optionalInput(z.iso.date().nullable()),
      endDate: optionalInput(z.iso.date().nullable()),
    })
    .check(({ value, issues }) => {
      if (value.status !== ReadingStatus.WISH && value.startDate !== null) {
        if (!z.date().min(new Date(book.publishedAt)).safeParse(new Date(value.startDate)).success) {
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
          if (value.startDate !== null) {
            issues.push({
              code: "custom",
              input: value,
              message: "읽고 싶은 책에는 시작일을 설정할 수 없습니다.",
              path: ["startDate"],
              fatal: true,
            });
          }
          if (value.endDate !== null) {
            issues.push({
              code: "custom",
              input: value,
              message: "읽고 싶은 책에는 종료일을 설정할 수 없습니다.",
              path: ["endDate"],
              fatal: true,
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
              fatal: true,
            });
          }
          if (value.endDate !== null) {
            issues.push({
              code: "custom",
              input: value,
              message: "읽고 있는 책에는 종료일을 설정할 수 없습니다.",
              path: ["endDate"],
              fatal: true,
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
              fatal: true,
            });
          }
          if (value.endDate !== null) {
            issues.push({
              code: "custom",
              input: value,
              message: "보류 중인 책에는 종료일을 설정할 수 없습니다.",
              path: ["endDate"],
              fatal: true,
            });
          }
          break;
        case ReadingStatus.FINISHED:
          if (value.startDate === null) {
            issues.push({
              code: "custom",
              input: value,
              message: "완료된 책에는 시작일을 설정해야 합니다.",
              path: ["startDate"],
              fatal: true,
            });
          }
          if (value.endDate === null) {
            issues.push({
              code: "custom",
              input: value,
              message: "완료된 책에는 완료일을 설정해야 합니다.",
              path: ["endDate"],
              fatal: true,
            });
          }
          if (
            isNotNil(value.startDate) &&
            isNotNil(value.endDate) &&
            !z.date().min(new Date(value.startDate)).safeParse(new Date(value.endDate)).success
          ) {
            issues.push({
              code: "custom",
              input: value,
              message: "완료일은 시작일 이후여야 합니다.",
              path: ["endDate"],
            });
          }
          break;
      }
    });
};

type BasicStepContext = z.input<ReturnType<typeof createBasicStepSchema>>;

export const recommandStepSchema = z.object({
  status: z.enum(ReadingStatus),
  startDate: z.iso.date().nullable(),
  endDate: z.iso.date().nullable(),
  recommand: optionalInput(z.boolean()),
  rating: optionalInput(ratingSchema, "평점을 선택해주세요."),
});

type RecommandStepContext = z.input<typeof recommandStepSchema>;

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

type BookReportStepContext = z.input<typeof bookReportStepSchema>;

export const quoteStepSchema = z.object({
  status: z.enum(ReadingStatus),
  startDate: z.iso.date().nullable(),
  endDate: z.iso.date().nullable(),
  recommand: z.boolean(),
  rating: ratingSchema,
  report: optionalInput(z.string().nullable()),
  quote: optionalInput(z.string().nullable()),
});

type QuoteStepContext = z.input<typeof quoteStepSchema>;

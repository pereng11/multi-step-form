import { Book } from "@/apis/book/vo/book";
import { isNil, isNotNil, optionalInput } from "@/utils/TypeUtil";
import * as z from "zod";
import { quoteSchema } from "../../../apis/review/vo/quote";
import { ratingSchema } from "../../../apis/review/vo/rating";
import { ReadingStatus } from "../../../apis/review/vo/readingStatus";

export type BookReviewFunnelContext = {
  step1: BasicStepContext;
  step2: RecommendStepContext;
  step3: BookReportStepContext;
  step4: QuoteStepContext;
  step5: PublishStepContext;
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

export const recommendStepSchema = z.object({
  status: z.enum(ReadingStatus),
  startDate: z.iso.date().nullable(),
  endDate: z.iso.date().nullable(),
  recommend: optionalInput(z.boolean().default(false)),
  rating: optionalInput(ratingSchema).refine((value) => value !== 0, {
    message: "평점을 선택해주세요.",
  }),
});

type RecommendStepContext = z.input<typeof recommendStepSchema>;

export const bookReportStepSchema = z
  .object({
    status: z.enum(ReadingStatus),
    startDate: z.iso.date().nullable(),
    endDate: z.iso.date().nullable(),
    recommend: z.boolean(),
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
        message: "평점이 1점 이하 또는 5점인 경우 리뷰를 100자 이상 작성해야 합니다.",
        path: ["report"],
      });
    }
  });

type BookReportStepContext = z.input<typeof bookReportStepSchema>;

export const createQuoteStepSchema = (book: Book) =>
  z
    .object({
      status: z.enum(ReadingStatus),
      startDate: z.iso.date().nullable(),
      endDate: z.iso.date().nullable(),
      recommend: z.boolean(),
      rating: ratingSchema,
      report: z.string().nullable(),
      quotes: optionalInput(z.array(quoteSchema)),
    })
    .check(({ value, issues }) => {
      if (value.quotes) {
        value.quotes.forEach((quote, index) => {
          if (value.quotes.length > 1) {
            if (isNil(quote.page)) {
              issues.push({
                code: "custom",
                input: value,
                message: "페이지 번호를 입력해주세요.",
                path: ["quotes", index, "page"],
              });
              return;
            }
          }

          if (isNotNil(quote.page) && quote.page < 1) {
            issues.push({
              code: "custom",
              input: value,
              message: "페이지 번호는 1 이상이어야 합니다.",
              path: ["quotes", index, "page"],
            });
            return;
          }

          if (isNotNil(quote.page) && quote.page > book.page) {
            issues.push({
              code: "custom",
              input: value,
              message: "페이지 번호는 책의 페이지 수를 넘을 수 없습니다.",
              path: ["quotes", index, "page"],
            });
            return;
          }
        });
      }
    });

export type QuoteStepContext = z.input<ReturnType<typeof createQuoteStepSchema>>;

export const publishStepSchema = z.object({
  status: z.enum(ReadingStatus),
  startDate: z.iso.date().nullable(),
  endDate: z.iso.date().nullable(),
  recommend: z.boolean(),
  rating: ratingSchema,
  report: z.string().nullable(),
  quotes: z.array(quoteSchema),
  isPublic: optionalInput(z.boolean()),
});

type PublishStepContext = z.input<typeof publishStepSchema>;

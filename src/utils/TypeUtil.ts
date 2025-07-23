import z, { ZodType } from "zod";

export const isNil = <T>(value: T | null | undefined): value is null | undefined => {
  return value === null || value === undefined;
};

export const isNotNil = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const optionalInput = <T extends ZodType>(schema: T, message = "output 타입은 undefined 일 수 없습니다.") => {
  return schema.optional().transform((val, ctx) => {
    if (val === undefined) {
      ctx.addIssue({
        code: "invalid_type",
        expected: schema.type,
        input: val,
        message,
        fatal: true,
      });

      return z.NEVER;
    }

    return val;
  });
};

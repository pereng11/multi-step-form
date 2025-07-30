import { isNotNil } from "./TypeUtil";

export const toTruthy = <T>(array: (T | null | undefined)[]): T[] =>
  array.filter(isNotNil);

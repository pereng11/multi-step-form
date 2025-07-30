import { isNil } from "./TypeUtil";

export const isValidDate = (
  date: Date | string | null | undefined
): date is Date | string => {
  if (isNil(date)) {
    return false;
  }
  return !Number.isNaN(new Date(date).getTime());
};

export const isDateAfter = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1 > d2;
};

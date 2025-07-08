import { ReadingStatus } from "./readingStatus";

export type StartDate<TStatus extends ReadingStatus> =
  TStatus extends ReadingStatus.WISH ? null : Date;
export type EndDate<TStatus extends ReadingStatus> =
  TStatus extends ReadingStatus.FINISHED ? Date : null;

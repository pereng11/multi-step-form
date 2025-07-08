import { Book } from "@/types/book";
import { Rating } from "./rating";
import { EndDate, StartDate } from "./readingDate";
import { ReadingStatus } from "./readingStatus";

export interface BasicStepContext<TStatus extends ReadingStatus> extends Book {
  status?: TStatus;
  startDate?: StartDate<TStatus>;
  endDate?: EndDate<TStatus>;
}

export interface RecommandStepContext<TStatus extends ReadingStatus>
  extends BasicStepContext<TStatus> {
  status: TStatus;
  startDate: StartDate<TStatus>;
  endDate: EndDate<TStatus>;
  recommand?: boolean;
  rating?: Rating;
}

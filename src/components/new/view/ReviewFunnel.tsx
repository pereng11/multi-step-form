import { useBooks } from "@/apis/book/request/useBooks";
import { useSimpleFunnel } from "@/hooks/funnel/useSimpleFunnel";
import { useSearchParams } from "next/navigation";
import { BookReviewFunnelContext } from "../types/stepContext";
import BasicStep from "./step1/BasicStep";
import RecommendStep from "./step2/RecommendStep";
import BookReportStep from "./step3/BookReportStep";
import QuoteStep from "./step4/QuoteStep";
import PublishStep from "./step5/PublishStep";

export const ReviewFunnel = () => {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("id");
  const { getBookById } = useBooks();

  const { Render } = useSimpleFunnel<BookReviewFunnelContext>({
    initial: {
      step: "step1",
      context: {},
    },
  });

  const book = getBookById(bookId ?? "");

  if (!book) {
    return <div>책을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <Render
        step1={(props) => <BasicStep {...props} book={book} />}
        step2={RecommendStep}
        step3={BookReportStep}
        step4={(props) => <QuoteStep {...props} book={book} />}
        step5={PublishStep}
      />
    </div>
  );
};

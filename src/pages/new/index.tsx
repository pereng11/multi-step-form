import { BookReviewFunnelContext } from "@/components/new/types/stepContext";
import BasicStep from "@/components/new/view/step1/BasicStep";
import RecommandStep from "@/components/new/view/step2/RecommandStep";
import BookReportStep from "@/components/new/view/step3/BookReportStep";
import QuoteStep from "@/components/new/view/step4/QuoteStep";
import PublishStep from "@/components/new/view/step5/PublishStep";
import { useSimpleFunnel } from "@/hooks/funnel/useSimpleFunnel";

export default function New() {
  // TODO: 책 정보 가져오기 API 연동
  const book = {
    id: "1",
    title: "눈물을 마시는 새",
    page: 1000,
    publishedAt: "2025-01-01",
  };

  const { Render } = useSimpleFunnel<BookReviewFunnelContext>({
    initial: {
      step: "step1",
      context: {},
    },
  });

  return (
    <div>
      <Render
        step1={(props) => <BasicStep {...props} book={book} />}
        step2={RecommandStep}
        step3={BookReportStep}
        step4={(props) => <QuoteStep {...props} book={book} />}
        step5={PublishStep}
      />
    </div>
  );
}

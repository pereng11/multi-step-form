import { BookReviewFunnelContext } from "@/components/new/types/funnel";
import BasicStep from "@/components/new/view/step1/BasicStep";
import RecommandStep from "@/components/new/view/step2/RecommandStep";
import { useSimpleFunnel } from "@/hooks/funnel/useSimpleFunnel";

export default function New() {
  const { Render } = useSimpleFunnel<BookReviewFunnelContext>({
    initial: {
      step: "step1",
      context: {
        id: "1",
        title: "눈물을 마시는 새",
        page: 1000,
        publishedAt: "2025-01-01",
      },
    },
  });

  return (
    <div>
      <Render step1={BasicStep} step2={RecommandStep} />
    </div>
  );
}

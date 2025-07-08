import BasicStep from "@/components/new/BasicStep";
import RecommandStep from "@/components/new/RecommandStep";
import { ReadingStatus } from "@/components/new/types/readingStatus";
import {
  BasicStepContext,
  RecommandStepContext,
} from "@/components/new/types/stepContext";
import { useSimpleFunnel } from "@/hooks/funnel/useSimpleFunnel";

export default function New() {
  const { Render } = useSimpleFunnel<{
    step1: BasicStepContext<ReadingStatus>;
    step2: RecommandStepContext<ReadingStatus>;
  }>({
    initial: {
      step: "step1",
      context: {
        id: "1",
        title: "눈물을 마시는 새",
        page: 1000,
        publishedAt: new Date("2025-01-01"),
      },
    },
  });

  return (
    <div>
      <Render
        step1={({ context, history }) => (
          <BasicStep
            context={context}
            onNext={(ctx) => history.push("step2", ctx)}
          />
        )}
        step2={({ context }) => (
          <RecommandStep context={context} onNext={() => {}} />
        )}
      />
    </div>
  );
}

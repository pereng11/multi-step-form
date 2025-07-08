import BasicStep, { BasicStepContext } from "@/components/new/BasicStep";
import { useSimpleFunnel } from "@/hooks/funnel/useSimpleFunnel";

export default function New() {
  const { Render } = useSimpleFunnel<{
    step1: BasicStepContext;
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
        step1={({ context }) => (
          <BasicStep context={context} onNext={() => {}} />
        )}
      />
    </div>
  );
}

import { QueryBoundary } from "@/components/common/boundary/QueryBoundary";
import { ReviewFunnel } from "@/components/new/view/ReviewFunnel";

export default function New() {
  return (
    <QueryBoundary>
      <ReviewFunnel />
    </QueryBoundary>
  );
}

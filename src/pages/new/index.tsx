import { ReviewFunnel } from "@/components/new/view/ReviewFunnel";
import { Suspense } from "react";

export default function New() {
  return (
    <Suspense>
      <ReviewFunnel />
    </Suspense>
  );
}

import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FormFrame } from "@/components/common/FormFrame";
import { FormItem } from "@/components/common/FormItem";
import { FunnelStepComponentProps } from "@/hooks/funnel/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BookReviewFunnelContext, bookReportStepSchema } from "../../types/stepContext";

interface Props extends FunnelStepComponentProps<BookReviewFunnelContext, "step3"> {}

export default function BookReportStep({ context, history }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookReportStepSchema),
    defaultValues: {
      ...context,
    },
  });

  const onSubmit = handleSubmit((data) => {
    history.push("step4", data);
  });

  return (
    <FormFrame onSubmit={onSubmit}>
      <FormItem>
        <label htmlFor="report">리뷰</label>
        <textarea id="report" {...register("report")} />
        {errors.report && <ErrorMessage>{errors.report.message}</ErrorMessage>}
      </FormItem>
      <button type="submit">다음</button>
    </FormFrame>
  );
}

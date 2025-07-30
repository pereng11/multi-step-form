import { FormFrame } from "@/components/common/FormFrame";
import { FormItem } from "@/components/common/FormItem";
import { FunnelStepComponentProps } from "@/hooks/funnel/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BookReviewFunnelContext, publishStepSchema } from "../../types/stepContext";

interface Props extends FunnelStepComponentProps<BookReviewFunnelContext, "step5"> {}

export default function PublishStep({ context }: Props) {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(publishStepSchema),
    defaultValues: {
      ...context,
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <FormFrame onSubmit={onSubmit}>
      <FormItem>
        <label htmlFor="isPublic">공개 여부</label>
        <input type="checkbox" id="isPublic" {...register("isPublic")} />
      </FormItem>
      <button type="submit">저장</button>
    </FormFrame>
  );
}

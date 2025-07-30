import { ErrorMessage } from "@/components/common/form/ErrorMessage";
import { FunnelStepComponentProps } from "@/hooks/funnel/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Rating } from "../../../../apis/review/vo/rating";
import { FormFrame } from "../../../common/form/FormFrame";
import { FormItem } from "../../../common/form/FormItem";
import { BookReviewFunnelContext, recommendStepSchema } from "../../types/stepContext";
import { StarRatingInput } from "./StarRatingInput";

interface Props extends FunnelStepComponentProps<BookReviewFunnelContext, "step2"> {}

export default function RecommendStep({ context, history }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: zodResolver(recommendStepSchema),
    defaultValues: {
      ...context,
    },
  });

  const handleChangeRating = (value: Rating) => {
    setValue("rating", value);
    clearErrors("rating");
  };

  const onSubmit = handleSubmit((data) => {
    history.push("step3", data);
  });

  return (
    <FormFrame onSubmit={onSubmit}>
      <FormItem direction="row">
        <label htmlFor="recommend">추천할까요?</label>
        <input id="recommend" type="checkbox" {...register("recommend")} />
      </FormItem>
      <FormItem>
        <label htmlFor="rating">평점</label>
        <StarRatingInput
          {...register("rating", {
            valueAsNumber: true,
          })}
          value={watch("rating")}
          onChange={handleChangeRating}
        />
        {errors.rating && <ErrorMessage>{errors.rating.message}</ErrorMessage>}
      </FormItem>
      <button type="submit">다음</button>
    </FormFrame>
  );
}

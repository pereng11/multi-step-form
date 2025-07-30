import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FunnelStepComponentProps } from "@/hooks/funnel/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormFrame } from "../../../common/FormFrame";
import { FormItem } from "../../../common/FormItem";
import { Rating } from "../../types/rating";
import { BookReviewFunnelContext, recommandStepSchema } from "../../types/stepContext";
import { StarRatingInput } from "./StarRatingInput";

interface Props extends FunnelStepComponentProps<BookReviewFunnelContext, "step2"> {}

export default function RecommandStep({ context, history }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: zodResolver(recommandStepSchema),
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
        <label htmlFor="recommand">추천할까요?</label>
        <input id="recommand" type="checkbox" {...register("recommand")} />
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

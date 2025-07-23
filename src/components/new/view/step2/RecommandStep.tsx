import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormFrame } from "../../../common/FormFrame";
import { FormItem } from "../../../common/FormItem";
import { Rating } from "../../types/rating";
import { RecommandStepInputContext, RecommandStepOutputContext, recommandStepSchema } from "../../types/stepContext";
import { StarRatingInput } from "./StarRatingInput";

interface Props {
  context: RecommandStepInputContext;
  onNext: (context: RecommandStepOutputContext) => void;
}

export default function RecommandStep({ context, onNext }: Props) {
  const { register, handleSubmit, setValue, watch, getFieldState, trigger, getValues, clearErrors } = useForm({
    resolver: zodResolver(recommandStepSchema),
    defaultValues: {
      ...context,
    },
  });

  const handleChangeRating = (value: Rating) => {
    setValue("rating", value);
    clearErrors("rating");
  };

  const onError = () => {
    const values = getValues();
    Object.keys(values).forEach((fieldName) => {
      if (fieldName !== "recommand" && fieldName !== "rating") {
        return;
      }

      setValue(fieldName, values[fieldName], {
        shouldTouch: true,
        shouldValidate: true,
      });
    });
    trigger();
  };

  return (
    <FormFrame onSubmit={handleSubmit(onNext, onError)}>
      <h1>{context.title}</h1>
      <FormItem direction="row">
        <label htmlFor="recommand">추천할까요?</label>
        <input id="recommand" type="checkbox" {...register("recommand")} />
      </FormItem>
      <FormItem>
        <label htmlFor="rating">평점</label>
        <StarRatingInput
          {...register("rating")}
          value={watch("rating")}
          onChange={handleChangeRating}
          isError={getFieldState("rating").invalid}
        />
      </FormItem>
      <button type="submit">다음</button>
    </FormFrame>
  );
}

import { useForm } from "react-hook-form";
import { FormFrame } from "../../../common/FormFrame";
import { FormItem } from "../../../common/FormItem";
import { ReadingStatus } from "../../types/readingStatus";
import { RecommandStepContext } from "../../types/stepContext";
import { StarRatingInput } from "./StarRatingInput";

interface Props<TStatus extends ReadingStatus> {
  context: RecommandStepContext<TStatus>;
  onNext: (context: RecommandStepContext<TStatus>) => void;
}

export default function RecommandStep<TStatus extends ReadingStatus>({
  context,
  onNext,
}: Props<TStatus>) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getFieldState,
    trigger,
    getValues,
  } = useForm<RecommandStepContext<TStatus>>({
    defaultValues: {
      recommand: context.recommand ?? true,
      rating: context.rating,
    },
  });

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
          {...register("rating", { required: true })}
          value={watch("rating")}
          onChange={(v) => setValue("rating", v)}
          isError={getFieldState("rating").invalid}
        />
      </FormItem>
      <button type="submit">다음</button>
    </FormFrame>
  );
}

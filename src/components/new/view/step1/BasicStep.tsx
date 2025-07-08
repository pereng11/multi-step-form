import { ReadingStatus } from "@/components/new/types/readingStatus";
import { isDateAfter, isValidDate } from "@/utils/DateUtil";
import { isNotNil } from "@/utils/TypeUtil";
import { useForm } from "react-hook-form";
import { FormFrame } from "../../../common/FormFrame";
import { FormItem } from "../../../common/FormItem";
import {
  BasicStepContext,
  RecommandStepContext,
} from "../../types/stepContext";

interface Props<TStatus extends ReadingStatus> {
  context: BasicStepContext<TStatus>;
  onNext: <T extends ReadingStatus>(context: RecommandStepContext<T>) => void;
}

export default function BasicStep<TStatus extends ReadingStatus>({
  context,
  onNext,
}: Props<TStatus>) {
  const { register, watch, handleSubmit, setValue } = useForm<
    BasicStepContext<TStatus>
  >({
    defaultValues: {
      status: context.status,
      startDate: context.startDate,
      endDate: context.endDate,
    },
  });

  const needStartDate =
    isNotNil(watch("status")) && watch("status") !== ReadingStatus.WISH;
  const needEndDate = watch("status") === ReadingStatus.FINISHED;

  const statusRegister = register("status", {
    required: true,
  });

  const handleChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === ReadingStatus.WISH) {
      setValue("startDate", undefined);
    }
    if (e.target.value !== ReadingStatus.FINISHED) {
      setValue("endDate", undefined);
    }

    statusRegister.onChange(e);
  };

  const onSubmit = handleSubmit(
    (data) => {
      const status = data.status!;
      const contextReturn: RecommandStepContext<typeof status> = {
        ...context,
        status,
        startDate: data.startDate!,
        endDate: data.endDate!,
      };
      onNext(contextReturn);
    },
    (errors) => {
      console.log(errors);
    }
  );

  return (
    <FormFrame onSubmit={onSubmit}>
      <h1>{context.title}</h1>
      <FormItem>
        <span>출판일</span>
        <p>{context.publishedAt.toLocaleDateString()}</p>
      </FormItem>
      <FormItem>
        <span>독서 상태</span>
        {Object.values(ReadingStatus).map((status) => (
          <label key={status} htmlFor={`status-${status}`}>
            <input
              {...statusRegister}
              id={`status-${status}`}
              type="radio"
              value={status}
              onChange={handleChangeStatus}
            />
            <span>{status}</span>
          </label>
        ))}
      </FormItem>
      {needStartDate && (
        <FormItem>
          <label htmlFor="startDate">시작일</label>
          <input
            id="startDate"
            type="date"
            {...register("startDate", {
              min: context.publishedAt.toISOString(),
              required: needStartDate,
            })}
          />
        </FormItem>
      )}
      {needEndDate && (
        <FormItem>
          <label htmlFor="endDate">완료일</label>
          <input
            id="endDate"
            type="date"
            {...register("endDate", {
              required: needEndDate,
              validate: (value, formValues) => {
                if (!isValidDate(value) || !isValidDate(formValues.startDate)) {
                  return "올바른 날짜를 입력해주세요.";
                }
                if (isDateAfter(formValues.startDate, value)) {
                  return "완료일은 시작일 이후여야 합니다.";
                }
                return true;
              },
            })}
          />
        </FormItem>
      )}
      <button type="submit">Next</button>
    </FormFrame>
  );
}

import { Book } from "@/types/book";
import { isNotNil } from "@/utils/TypeUtil";
import { useForm } from "react-hook-form";
import { FormFrame } from "../common/FormFrame";
import { FormItem } from "../common/FormItem";

enum ReadingStatus {
  WISH = "wish",
  READING = "reading",
  FINISHED = "finished",
  PENDING = "pending",
}

type StartDate<TStatus extends ReadingStatus> =
  TStatus extends ReadingStatus.WISH ? null : Date;
type EndDate<TStatus extends ReadingStatus> =
  TStatus extends ReadingStatus.FINISHED ? Date : null;

export interface BasicStepContext<TStatus extends ReadingStatus = never>
  extends Book {
  status?: TStatus;
  startDate?: StartDate<TStatus>;
  endDate?: EndDate<TStatus>;
}

interface Props<TStatus extends ReadingStatus> {
  context: BasicStepContext<TStatus>;
  onNext: (context: BasicStepContext<TStatus>) => void;
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

  const needStartDate =
    isNotNil(watch("status")) && watch("status") !== ReadingStatus.WISH;
  const needEndDate = watch("status") === ReadingStatus.FINISHED;

  const onSubmit = handleSubmit((data) => {
    onNext(data);
  });

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
              // min: watch("startDate")?.toISOString(),
              required: needEndDate,
            })}
          />
        </FormItem>
      )}
      <button type="submit">Next</button>
    </FormFrame>
  );
}

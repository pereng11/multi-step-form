import { ReadingStatus } from "@/components/new/types/readingStatus";
import { FunnelStepComponentProps } from "@/hooks/funnel/types";
import { isNotNil } from "@/utils/TypeUtil";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormFrame } from "../../../common/FormFrame";
import { FormItem } from "../../../common/FormItem";
import { BookReviewFunnelContext } from "../../types/funnel";
import { basicStepSchema } from "../../types/stepContext";

interface Props extends FunnelStepComponentProps<BookReviewFunnelContext, "step1"> {}

export default function BasicStep({ context, history }: Props) {
  const { register, watch, handleSubmit, setValue } = useForm({
    resolver: zodResolver(basicStepSchema),
    defaultValues: {
      ...context,
    },
  });

  const needStartDate = isNotNil(watch("status")) && watch("status") !== ReadingStatus.WISH;
  const needEndDate = watch("status") === ReadingStatus.FINISHED;

  const statusRegister = register("status");

  const handleChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.value) {
      case ReadingStatus.WISH:
        setValue("startDate", null);
        setValue("endDate", null);
        break;
      case ReadingStatus.READING:
      case ReadingStatus.PENDING:
        setValue("endDate", null);
        break;
      case ReadingStatus.FINISHED:
        break;
    }

    statusRegister.onChange(e);
  };

  const onSubmit = handleSubmit(
    (data) => {
      history.push("step2", data);
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
        <p>{context.publishedAt}</p>
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
          <input id="startDate" type="date" {...register("startDate")} />
        </FormItem>
      )}
      {needEndDate && (
        <FormItem>
          <label htmlFor="endDate">완료일</label>
          <input id="endDate" type="date" {...register("endDate")} />
        </FormItem>
      )}
      <button type="submit">Next</button>
    </FormFrame>
  );
}

import { Book } from "@/apis/book/vo/book";
import { ReadingStatus } from "@/apis/review/vo/readingStatus";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FunnelStepComponentProps } from "@/hooks/funnel/types";
import { isNil, isNotNil } from "@/utils/TypeUtil";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormFrame } from "../../../common/FormFrame";
import { FormItem } from "../../../common/FormItem";
import { BookReviewFunnelContext, createBasicStepSchema } from "../../types/stepContext";

interface Props extends FunnelStepComponentProps<BookReviewFunnelContext, "step1"> {
  book: Book;
}

export default function BasicStep({ context, history, book }: Props) {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(createBasicStepSchema(book)),
    defaultValues: {
      ...context,
    },
  });

  const needStartDate = isNotNil(watch("status")) && watch("status") !== ReadingStatus.WISH;
  const needEndDate = watch("status") === ReadingStatus.FINISHED;

  const statusRegister = register("status");

  const handleChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { startDate, endDate } = getValues();
    switch (e.target.value) {
      case ReadingStatus.WISH:
        setValue("startDate", null);
        setValue("endDate", null);
        break;
      case ReadingStatus.READING:
      case ReadingStatus.PENDING:
        if (isNil(startDate) || startDate === "") {
          setValue("startDate", null);
        }
        setValue("endDate", null);
        break;
      case ReadingStatus.FINISHED:
        if (isNil(startDate) || startDate === "") {
          setValue("startDate", null);
        }
        if (isNil(endDate) || endDate === "") {
          setValue("endDate", null);
        }
        break;
    }

    statusRegister.onChange(e);

    if (isSubmitted) {
      trigger();
    }
  };

  const onSubmit = handleSubmit((data) => {
    history.push("step2", data);
  });

  return (
    <FormFrame onSubmit={onSubmit}>
      <h1>{book.title}</h1>
      <FormItem>
        <span>출판일</span>
        <p>{book.publishedAt}</p>
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
        {errors.status && <ErrorMessage>{errors.status.message}</ErrorMessage>}
      </FormItem>
      {needStartDate && (
        <FormItem>
          <label htmlFor="startDate">시작일</label>
          <input id="startDate" type="date" {...register("startDate")} />
          {errors.startDate && <ErrorMessage>{errors.startDate.message}</ErrorMessage>}
        </FormItem>
      )}
      {needEndDate && (
        <FormItem>
          <label htmlFor="endDate">완료일</label>
          <input id="endDate" type="date" {...register("endDate")} />
          {errors.endDate && <ErrorMessage>{errors.endDate.message}</ErrorMessage>}
        </FormItem>
      )}
      <button type="submit">Next</button>
    </FormFrame>
  );
}

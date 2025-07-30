import { FormFrame } from "@/components/common/FormFrame";
import { FunnelStepComponentProps } from "@/hooks/funnel/types";
import { Book } from "@/types/book";
import styled from "@emotion/styled";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { BookReviewFunnelContext, createQuoteStepSchema } from "../../types/stepContext";
import { QuoteItem } from "./QuoteItem";

interface Props extends FunnelStepComponentProps<BookReviewFunnelContext, "step4"> {
  book: Book;
}

export default function QuoteStep({ context, history, book }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createQuoteStepSchema(book)),
    defaultValues: {
      ...context,
      quotes: context.quotes ?? [{ quote: "", page: undefined }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "quotes",
  });

  const onSubmit = handleSubmit((data) => {
    history.push("step5", data);
  });

  return (
    <FormFrame onSubmit={onSubmit}>
      <span>인용구</span>
      <QuoteList>
        {fields.map((field, index) => (
          <QuoteItem key={field.id} field={field} index={index} register={register} remove={remove} errors={errors} />
        ))}
      </QuoteList>
      <AddButton type="button" onClick={() => append({ quote: "", page: undefined })}>
        추가
      </AddButton>
      <button type="submit">다음</button>
    </FormFrame>
  );
}

const QuoteList = styled.ol`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AddButton = styled.button`
  width: 100px;
`;

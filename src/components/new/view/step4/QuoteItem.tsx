import { ErrorMessage } from "@/components/common/ErrorMessage";
import { isNil } from "@/utils/TypeUtil";
import styled from "@emotion/styled";
import { FieldArrayWithId, FieldErrors, UseFormRegister } from "react-hook-form";
import { QuoteStepContext } from "../../types/stepContext";

interface Props {
  field: FieldArrayWithId<QuoteStepContext, "quotes", "id">;
  index: number;
  register: UseFormRegister<QuoteStepContext>;
  remove: (index: number) => void;
  errors: FieldErrors<QuoteStepContext>;
}

export const QuoteItem = ({ field, index, register, remove, errors }: Props) => {
  const quoteError = errors.quotes?.[index]?.quote;
  const pageError = errors.quotes?.[index]?.page;

  return (
    <Item key={field.id}>
      <span>{index + 1}</span>
      <div className="input-wrapper">
        <div className="quote-wrapper">
          <input id="quote" {...register(`quotes.${index}.quote`)} />
          {quoteError && <ErrorMessage>{quoteError.message}</ErrorMessage>}
        </div>
        <div className="page-wrapper">
          <div className="page-input-wrapper">
            <input
              type="number"
              id="page"
              {...register(`quotes.${index}.page`, {
                setValueAs: (value) => (isNil(value) || value === "" ? undefined : Number(value)),
              })}
            />
            <span>page</span>
          </div>
          {pageError && <ErrorMessage>{pageError.message}</ErrorMessage>}
        </div>
      </div>
      <RemoveButton type="button" onClick={() => remove(index)}>
        X
      </RemoveButton>
    </Item>
  );
};

const Item = styled.li`
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #000;

  > .input-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;

    > .quote-wrapper {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    > .page-wrapper {
      display: flex;
      flex-direction: column;
      gap: 10px;

      > .page-input-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    }
  }
`;

const RemoveButton = styled.button`
  width: 32px;
`;

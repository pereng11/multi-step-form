import styled from "@emotion/styled";
import { PropsWithChildren } from "react";

interface Props {
  onSubmit: () => void;
}

export const FormFrame = ({ onSubmit, children }: PropsWithChildren<Props>) => {
  return <Form onSubmit={onSubmit}>{children}</Form>;
};

const Form = styled.form`
  width: 400px;
  min-height: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #000;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

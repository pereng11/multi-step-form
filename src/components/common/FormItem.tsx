import styled from "@emotion/styled";

export const FormItem = styled.div<{
  direction?: "row" | "column";
}>`
  display: flex;
  flex-direction: ${({ direction }) => direction ?? "column"};
  gap: 10px;
  width: 100%;
  padding: 0 20px;
`;

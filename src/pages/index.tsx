import { BookList } from "@/components/home/view/BookList";
import styled from "@emotion/styled";
import { Suspense } from "react";

export default function Home() {
  return (
    <Container>
      <h1>책 리뷰 작성하기</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <BookList />
      </Suspense>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 100vh;
`;

import { QueryBoundary } from "@/components/common/boundary/QueryBoundary";
import { BookList } from "@/components/home/view/BookList";
import styled from "@emotion/styled";

export default function Home() {
  return (
    <Container>
      <h1>책 리뷰 작성하기</h1>
      <QueryBoundary>
        <BookList />
      </QueryBoundary>
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

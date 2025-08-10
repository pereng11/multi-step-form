import { useBooks } from "@/apis/book/request/useBooks";

import styled from "@emotion/styled";
import Link from "next/link";

export const BookList = () => {
  const { books } = useBooks();

  return (
    <Container>
      {books.map((book) => (
        <li key={book.id}>
          <Link className="title" href={`/new?id=${book.id}`}>
            {book.title}
          </Link>
          <span>
            {book.page} 페이지, {book.publishedAt} 출간
          </span>
        </li>
      ))}
    </Container>
  );
};

const Container = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #000;
    padding: 10px;
    border-radius: 10px;

    .title {
      font-size: 1.2rem;
      font-weight: bold;
    }
  }
`;

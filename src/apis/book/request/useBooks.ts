import { useSuspenseQuery } from "@tanstack/react-query";
import { ReadBookListRs } from "../rqrs/ReadBookListRs";
import { Book } from "../vo/book";

export const BOOKS_QUERY_KEY = "books";

export const readBookList = async () => {
  const response = await fetch("http://localhost:3000/api/books");
  const data = await response.json();
  return data;
};

export const useBooks = () => {
  const { data, ...rest } = useSuspenseQuery<ReadBookListRs>({
    queryKey: [BOOKS_QUERY_KEY],
    queryFn: () => readBookList(),
  });

  const getBook = (bookId: string) => {
    return data.books.find((book: Book) => book.id === bookId);
  };

  return {
    books: data.books,
    getBook,
    ...rest,
  };
};

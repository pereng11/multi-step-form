import { Book } from "@/apis/book/vo/book";
import { NextApiRequest, NextApiResponse } from "next";

const BOOKS: Book[] = [
  {
    id: "1",
    title: "눈물을 마시는 새",
    page: 100,
    publishedAt: "2021-01-01",
  },
  {
    id: "2",
    title: "피를 마시는 새",
    page: 200,
    publishedAt: "2022-01-02",
  },
  {
    id: "3",
    title: "독을 마시는 새",
    page: 300,
    publishedAt: "2026-01-03",
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json({ books: BOOKS });
  }
}

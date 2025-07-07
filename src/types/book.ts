import { ID } from "./id";

export interface Book {
  id: ID;
  title: string;
  page: number;
  publishedAt: Date;
}

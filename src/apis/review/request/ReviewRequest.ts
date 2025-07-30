import { CreateReviewRq } from "../rqrs/CreateReviewRq";

export const ReviewRequest = {
  create: async (rq: CreateReviewRq) => {
    const response = await fetch(`/api/review`, {
      method: "POST",
      body: JSON.stringify(rq),
    });

    if (!response.ok) {
      throw new Error("Failed to create review");
    }

    return response.json();
  },
};

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const rq = await req.body;
    console.log(rq);
    res.status(200).json({ message: "Review created" });
  }
}

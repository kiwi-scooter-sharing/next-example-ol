import { NextApiRequest, NextApiResponse } from "next";

// in-memory for test
const points: [number, number][] = [];

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    points.push(req.body.coord);

    res.json(points);
  } else {
    res.json(points);
  }
};

export default handler;

import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { fid } = req.query;

  try {
    const { result: user } = await neynarClient.lookupUserByFid(Number(fid));
    return res.status(200).json({ user: user.user });
  } catch (err) {
    if (isApiErrorResponse(err)) {
      return res.status(err.response.status).json({ ...err.response.data });
    } else return res.status(500).json({ message: "Something went wrong" });
  }
};

export default handler;

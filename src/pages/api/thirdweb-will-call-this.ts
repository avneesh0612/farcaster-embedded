import neynarClient from "@/clients/neynar";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { payload } = req.body;
  console.log(req.body, "req.body");

  if (!payload) return res.status(401).json({ message: "Invalid credentials" });

  const {
    result: { user },
  } = await neynarClient.lookupUserByFid(payload.userId);
  if (user)
    return res.status(200).json({
      isVerifiedUser: true,
      userId: user.fid,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    });

  return res.status(200).json({ isVerifiedUser: false });
};

export default handler;

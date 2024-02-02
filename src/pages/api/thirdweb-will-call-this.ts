import neynarClient from "@/clients/neynar";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { payload } = JSON.parse(req.body);
  console.log(payload);

  if (!payload) return res.status(401).json({ message: "Invalid credentials" });

  if (!payload.fid) return res.status(401).json({ message: "fid absent" });
  const {
    result: { user },
  } = await neynarClient.lookupUserByFid(payload.fid);
  if (user)
    return res.status(200).json({
      userId: user.fid,
      isVerifiedUser: true,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    });

  return res.status(200).json({ isVerifiedUser: false });
};

export default handler;

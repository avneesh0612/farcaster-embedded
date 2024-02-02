import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { signerUuid, fid } = req.body;

  let isVerifiedUser = false;
  try {
    const { fid: userFid } = await neynarClient.lookupSigner(signerUuid);

    if (userFid === Number(fid)) {
      isVerifiedUser = true;
    } else isVerifiedUser = false;
    return res.status(200).json({ isVerifiedUser });
  } catch (err) {
    if (isApiErrorResponse(err)) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;

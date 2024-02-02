import neynarClient from "@/clients/neynar";
import { isApiErrorResponse } from "@neynar/nodejs-sdk";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { signerUuid, userId } = req.body;

  let isVerifiedUser = false;
  try {
    const { fid: userFid } = await neynarClient.lookupSigner(signerUuid);

    if (Number(userFid) === Number(userId)) {
      isVerifiedUser = true;
    } else {
      isVerifiedUser = false;
    }

    return res.status(200).json({
      isVerifiedUser,
      payload: {
        userId: userFid,
      },
    });
  } catch (err) {
    if (isApiErrorResponse(err)) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;

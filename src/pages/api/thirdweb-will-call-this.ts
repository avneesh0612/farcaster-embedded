import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { payload } = req.body;
  const { signature, message, nonce } = JSON.parse(payload);

  if (!signature || !message || !nonce) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const appClient = createAppClient({
    ethereum: viemConnector(),
  });

  const verifyResponse = await appClient.verifySignInMessage({
    message: message as string,
    signature: signature as `0x${string}`,
    domain: "example.com",
    nonce,
  });
  const {  fid } = verifyResponse;

  if (fid)
    return res.status(200).json({
      userId: String(fid),
      isVerifiedUser: true,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    });

  return res.status(200).json({ isVerifiedUser: false });
};

export default handler;

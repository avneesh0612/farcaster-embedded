import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { payload } = req.body;
  const { signature, message, csrfToken } = JSON.parse(payload);

  if (!payload) return res.status(401).json({ message: "Invalid credentials" });

  if (!signature) return res.status(401).json({ message: "signature absent" });

  const appClient = createAppClient({
    ethereum: viemConnector(),
  });

  const verifyResponse = await appClient.verifySignInMessage({
    message: message as string,
    signature: signature as `0x${string}`,
    domain: "example.com",
    nonce: csrfToken,
  });
  const { success, fid } = verifyResponse;

  if (fid)
    return res.status(200).json({
      userId: String(fid),
      isVerifiedUser: true,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    });

  return res.status(200).json({ isVerifiedUser: false });
};

export default handler;

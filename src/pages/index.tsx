import {
  SignInButton,
  StatusAPIResponse,
  useProfile,
  useSignIn,
} from "@farcaster/auth-kit";
import {
  ConnectWallet,
  useAddress,
  useDisconnect,
  useEmbeddedWallet
} from "@thirdweb-dev/react";
import { NextPage } from "next";
import { useCallback } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const embeddedWallet = useEmbeddedWallet();
  const address = useAddress();
  const disconnect = useDisconnect();
  const { isAuthenticated } = useProfile();
  const { signOut } = useSignIn({});

  const handleSuccess = useCallback(
    async (res: StatusAPIResponse) => {
      await embeddedWallet.connect({
        strategy: "auth_endpoint",
        payload: JSON.stringify({
          signature: res.signature,
          message: res.message,
          nonce: res.nonce,
        }),
        encryptionKey: `0x${res.signature}`,
      });
    },
    [embeddedWallet]
  );

  return (
    <div className={styles.container}>
      {address ? (
        <>
          <h1>{address}</h1>
          <ConnectWallet />
        </>
      ) : (
        <>
          {isAuthenticated ? (
            <>
              <h1>Connected using farcaster</h1>
              <button onClick={() => signOut()}>Sign Out</button>
            </>
          ) : (
            <SignInButton
              onSuccess={handleSuccess}
              onError={(err) => console.log(err)}
              onSignOut={() => disconnect()}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Home;

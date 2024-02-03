import { Header } from "@/components/Header";
import useLocalStorage from "@/hooks/use-local-storage-state";
import { UserInfo } from "@/types";
import { SignInButton, StatusAPIResponse } from "@farcaster/auth-kit";
import {
  useAddress,
  useDisconnect,
  useEmbeddedWallet,
} from "@thirdweb-dev/react";
import { NextPage } from "next";
import { useCallback } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const embeddedWallet = useEmbeddedWallet();
  const [user, _1, removeItem] = useLocalStorage<UserInfo>("user");
  const address = useAddress();
  const disconnect = useDisconnect();

  const handleSuccess = useCallback(async (res: StatusAPIResponse) => {
    console.log(res);

    await embeddedWallet.connect({
      strategy: "auth_endpoint",
      payload: JSON.stringify({
        signature: res.signature,
        message: res.message,
        nonce: res.nonce,
      }),
      encryptionKey: `0x${res.signature}`,
    });
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      {address ? <p>{address}</p> : <p>No wallet associated with this acc. </p>}
      <SignInButton
        onSuccess={handleSuccess}
        onError={(err) => console.log(err)}
        onSignOut={() => disconnect()}
      />
    </div>
  );
};

export default Home;

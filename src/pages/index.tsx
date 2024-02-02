import { Header } from "@/components/Header";
import { useAddress, useEmbeddedWallet } from "@thirdweb-dev/react";
import { NextPage } from "next";
import styles from "../styles/Home.module.css";
import useLocalStorage from "@/hooks/use-local-storage-state";
import { UserInfo } from "@/types";

const Home: NextPage = () => {
  const embeddedWallet = useEmbeddedWallet();
  const [user, _1, removeItem] = useLocalStorage<UserInfo>("user");
  const address = useAddress();

  const handlePostLogin = async () => {
    if (!embeddedWallet || !user.fid || !user.signerUuid) {
      return;
    }

    const res = await embeddedWallet.connect({
      strategy: "auth_endpoint",
      payload: JSON.stringify({ userId: user.fid }),
      encryptionKey: user.signerUuid,
    });

    console.log(res);
  };

  console.log(address);

  return (
    <div className={styles.container}>
      <Header />
      {address ? (
        <p>{address}</p>
      ) : (
        <button onClick={handlePostLogin}>Connect Wallet</button>
      )}
    </div>
  );
};

export default Home;

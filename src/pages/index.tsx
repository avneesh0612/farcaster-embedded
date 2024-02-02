import { Header } from "@/components/Header";
import useLocalStorage from "@/hooks/use-local-storage-state";
import { UserInfo } from "@/types";
import {
  useAddress,
  useEmbeddedWallet
} from "@thirdweb-dev/react";
import { NextPage } from "next";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const embeddedWallet = useEmbeddedWallet();
  const [user, _1, removeItem] = useLocalStorage<UserInfo>("user");
  const address = useAddress();

  const handleConnect = async () => {
    if (!user) {
      return;
    }

    await embeddedWallet.connect({
      strategy: "auth_endpoint",
      payload: JSON.stringify({ fid: user.fid }),
      encryptionKey: user.signerUuid,
    });
  };

  useEffect(() => {
    if (!address) {
      handleConnect();
    }
  }, [address]);

  return (
    <div className={styles.container}>
      <Header />
      {address ? <p>{address}</p> : <p>No wallet associated with this acc. </p>}
    </div>
  );
};

export default Home;

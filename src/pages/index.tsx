import {
  SignInButton,
  StatusAPIResponse,
  useProfile,
  useSignIn,
} from "@farcaster/auth-kit";
import {
  ConnectWallet,
  Web3Button,
  embeddedWallet,
  useAddress,
  useConnectionStatus,
  useDisconnect,
  useSmartWallet,
} from "@thirdweb-dev/react";
import { NextPage } from "next";
import { useCallback, useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";

const Home: NextPage = () => {
  const address = useAddress();
  const disconnect = useDisconnect();
  const { isAuthenticated } = useProfile();
  const { signOut } = useSignIn({});
  const { connect } = useSmartWallet(embeddedWallet(), {
    factoryAddress: "0x505c8823AA7E5A2Df5cff74f0E727D658f35785e",
    gasless: true,
  });
  const [connecting, setConnecting] = useState(false);
  const connectionStatus = useConnectionStatus();

  const handleSuccess = useCallback(
    async (res: StatusAPIResponse) => {
      try {
        setConnecting(true);
        await connect({
          connectPersonalWallet: async (embeddedWallet) => {
            const authResult = await embeddedWallet.authenticate({
              strategy: "auth_endpoint",
              payload: JSON.stringify({
                signature: res.signature,
                message: res.message,
                nonce: res.nonce,
              }),
              encryptionKey: `0x${res.signature}`,
            });
            await embeddedWallet.connect({ authResult });
          },
        });
      } catch (e) {
        console.error(e);
      } finally {
        setConnecting(false);
      }
    },
    [connect]
  );

  if (connecting || connectionStatus === "connecting") {
    return (
      <div className={styles.container}>
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
          <h4>Connecting smart wallet</h4>
        </div>

        <Image
          src="/nft.png"
          alt="Farcaster x thirdweb NFT"
          width={300}
          height={300}
          className={styles.image}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {address ? (
        <>
          <div className={styles.header}>
            <ConnectWallet />
          </div>

          <p>✨ Mint your NFT</p>

          <Image
            src="/nft.png"
            alt="Farcaster x thirdweb NFT"
            width={300}
            height={300}
            className={styles.image}
          />

          <Web3Button
            contractAddress="0x8e15ED4e6f9B2a34DB335FE1319d07F3b96626e5"
            action={(contract) => contract.erc1155.claim(0, 1)}
            onSuccess={() => {
              alert("NFT claimed");
            }}
            className={styles.button}
          >
            Claim NFT
          </Web3Button>
        </>
      ) : (
        <>
          {isAuthenticated ? (
            <>
              <Image
                src="/nft.png"
                alt="Farcaster x thirdweb NFT"
                width={300}
                height={300}
                className={styles.image}
              />
              <button onClick={() => signOut()} className={styles.button}>
                Sign out of farcaster
              </button>
            </>
          ) : (
            <>
              <p>✨ Sign into Farcaster and mint an NFT</p>

              <Image
                src="/nft.png"
                alt="Farcaster x thirdweb NFT"
                width={300}
                height={300}
                className={styles.image}
              />

              <SignInButton
                onSuccess={handleSuccess}
                onError={(err) => console.error(err)}
                onSignOut={() => disconnect()}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

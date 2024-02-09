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
  useDisconnect,
  useSmartWallet,
} from "@thirdweb-dev/react";
import { NextPage } from "next";
import { useCallback } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const address = useAddress();
  const disconnect = useDisconnect();
  const { isAuthenticated } = useProfile();
  const { signOut } = useSignIn({});
  const { connect } = useSmartWallet(embeddedWallet(), {
    factoryAddress: "0x505c8823AA7E5A2Df5cff74f0E727D658f35785e",
    gasless: true,
  });

  const handleSuccess = useCallback(
    async (res: StatusAPIResponse) => {
      try {
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
      }
    },
    [connect]
  );

  return (
    <div className={styles.container}>
      {address ? (
        <>
          <ConnectWallet />
          <Web3Button
            contractAddress="0xC7982449f322c207d9E187FD42567B89eE08C009"
            action={(contract) => contract.erc721.claim(1)}
            onSuccess={(res) => {
              alert("NFT claimed");
              console.log(res);
            }}
            style={{ marginTop: "20px" }}
          >
            Claim NFT
          </Web3Button>
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
              onStatusResponse={(res) => {
                console.log(res);
              }}
              debug={true}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Home;

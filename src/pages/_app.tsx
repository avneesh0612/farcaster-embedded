import { AuthKitProvider } from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";
import {
  ThirdwebProvider,
  embeddedWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "mumbai";

const config = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  siweUri: "",
  domain: "thirdweb-example.com",
};

const personalWallet = embeddedWallet(); // or any other wallet
export const smartWalletConfig = smartWallet(personalWallet, {
  factoryAddress: "0x505c8823AA7E5A2Df5cff74f0E727D658f35785e",
  gasless: true,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthKitProvider config={config}>
      <ThirdwebProvider
        clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
        activeChain={activeChain}
        supportedWallets={[smartWalletConfig]}
      >
        <Component {...pageProps} />
      </ThirdwebProvider>
    </AuthKitProvider>
  );
}

export default MyApp;

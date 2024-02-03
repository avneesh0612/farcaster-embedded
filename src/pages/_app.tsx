import { AppProvider } from "@/Context/AppContext";
import { ThirdwebProvider, embeddedWallet } from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { AuthKitProvider } from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "mumbai";

const config = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  siweUri: "http://example.com/login",
  domain: "example.com",
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <AuthKitProvider config={config}>
        <ThirdwebProvider
          clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
          activeChain={activeChain}
          supportedWallets={[embeddedWallet()]}
        >
          <Component {...pageProps} />
        </ThirdwebProvider>
      </AuthKitProvider>
    </AppProvider>
  );
}

export default MyApp;

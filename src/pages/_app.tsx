import { AppProvider } from "@/Context/AppContext";
import {
  ThirdwebProvider,
  embeddedWallet
} from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "mumbai";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <ThirdwebProvider
        clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
        activeChain={activeChain}
        supportedWallets={[embeddedWallet()]}
      >
        <Component {...pageProps} />
      </ThirdwebProvider>
    </AppProvider>
  );
}

export default MyApp;

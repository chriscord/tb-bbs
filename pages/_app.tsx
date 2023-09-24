import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { activeChain, TWClientId } from "../const/constants";


// Function
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={TWClientId}
      activeChain={activeChain}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;

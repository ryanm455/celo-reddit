import Nav from "components/Nav";
import { ContractProvider } from "lib/contractKit";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";

import { ChakraProvider } from "@chakra-ui/react";

const Alert = dynamic(() => import("components/Alert"), { ssr: false });

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <ChakraProvider>
    <ContractProvider>
      <Head>
        <title>deddit</title>
      </Head>
      <Nav />
      <Component {...pageProps} />
      <Alert />
    </ContractProvider>
  </ChakraProvider>
);

export default App;

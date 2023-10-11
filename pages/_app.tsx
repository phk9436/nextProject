import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Gohome from "../components/Gohome";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Gohome />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

import "../styles/globals.css";
import "../styles/nprogress.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Gohome from "../components/Gohome";
import {useEffect} from "react";
import Router from "next/router";
import NProgress from "nprogress";

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    const start = () => {
      NProgress.start();
    }
    const end = () => {
      NProgress.done();
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
    };

  }, []);

  return (
    <Layout>
      <Gohome />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

import "../styles/globals.css";
import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import "typeface-roboto";
//import "typeface-poppins";
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

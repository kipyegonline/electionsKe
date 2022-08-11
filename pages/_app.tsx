import "../styles/globals.css";
import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import "typeface-roboto";
//import "typeface-poppins";
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
}
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

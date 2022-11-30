import { type AppType } from "next/dist/shared/lib/utils";
import { Playfair_Display } from "@next/font/google";

import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/main.scss";

export const playfairDisplay = Playfair_Display({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="buddyBody">
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
};

export default MyApp;

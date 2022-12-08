import { useState } from "react";
import { type AppType } from "next/dist/shared/lib/utils";
import { slide as Menu } from "react-burger-menu";
import "../styles/main.scss";

import { Playfair_Display } from "@next/font/google";

export const playfairDisplay = Playfair_Display({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  const [username, setUserName] = useState<string | null>(null);

  return (
    <>
      {username ? (
        <Menu>
          <h1 className={`${playfairDisplay.className} buddyTitle`}>
            Buddy, Empathetic Chatdog
          </h1>
          <p>World</p>
        </Menu>
      ) : null}
      <Component {...pageProps} passUsername={setUserName} />
    </>
  );
};

export default MyApp;

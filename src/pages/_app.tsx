import { useState } from "react";
import { type AppType } from "next/dist/shared/lib/utils";
import { slide as Menu } from "react-burger-menu";
import axios from "axios";
import Router from "next/router";
import Head from "next/head";
import "../styles/main.scss";

import { Playfair_Display } from "@next/font/google";

export const playfairDisplay = Playfair_Display({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  const [username, setUserName] = useState<string | null>(null);

  const handleClearChatHistory = async () => {
    try {
      await axios.delete("/api/messages");
      Router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      Router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Buddy, Empathetic Chatdog</title>
      </Head>
      {username ? (
        <Menu>
          <div>
            <h1
              className={`${playfairDisplay.className} buddyTitle`}
              style={{ marginBottom: "2rem" }}
            >
              Buddy, Empathetic Chatdog
            </h1>
            <p onClick={handleClearChatHistory}>Clear chat history</p>
          </div>
          <div className="buddyLogoutOptions">
            <p>Logged in as {username}</p>
            <p onClick={handleLogout}>Log out</p>
          </div>
        </Menu>
      ) : null}
      <Component {...pageProps} passUsername={setUserName} />
    </>
  );
};

export default MyApp;

import { useState } from "react";
import { type AppType } from "next/dist/shared/lib/utils";
import axios from "axios";
import Router from "next/router";
import Head from "next/head";
import "../styles/main.scss";
import "react-notifications-component/dist/theme.css";
import {
  ReactNotifications,
  Store,
  NOTIFICATION_TYPE,
} from "react-notifications-component";

import { slide as Menu } from "react-burger-menu";

import { Playfair_Display } from "@next/font/google";

export const playfairDisplay = Playfair_Display({ subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  const [username, setUserName] = useState<string | null>(null);

  const showNotification = (title: string, type: NOTIFICATION_TYPE) => {
    Store.addNotification({
      title,
      type,
      insert: "bottom",
      container: "bottom-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 3000,
        onScreen: true,
      },
    });

    return;
  };

  const handleClearChatHistory = async () => {
    try {
      await axios.delete("/api/messages");
      showNotification("Messages deleted.", "success");
      return Router.reload();
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
      <ReactNotifications />
      {username ? (
        <Menu>
          <div>
            <h1
              className={`${playfairDisplay.className} buddyTitle`}
              style={{ marginBottom: "2rem" }}
            >
              Buddy, Empathetic Chatdog
            </h1>
            <button
              className="buddyButton"
              onClick={handleClearChatHistory}
              id="clearChat"
            >
              Clear Chat History
            </button>
          </div>
          <div className="buddyLogoutOptions">
            <p>
              Logged in as <span style={{ color: "#e1acc5" }}>{username}</span>
            </p>
            <button
              className="buddyButton"
              onClick={handleLogout}
              style={{ marginTop: "1rem" }}
              id="logOut"
            >
              Log Out
            </button>
          </div>
        </Menu>
      ) : null}
      <Component
        {...pageProps}
        passUsername={setUserName}
        showNotification={showNotification}
      />
    </>
  );
};

export default MyApp;

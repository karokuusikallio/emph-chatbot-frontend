import { type NextPage } from "next";
import { useState, FormEvent, useEffect } from "react";
import Head from "next/head";

import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbox from "../components/Chatbox";
import LoginForm from "../components/LoginForm";

interface HomePageProps extends NextPage {
  passUsername: (username: string) => void;
}

const Home: NextPage = (props: HomePageProps) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get("/api/user/me");
        props.passUsername(response.data.userName);
        setUsername(response.data.userName);
      } catch (error) {
        console.log(error);
      }
    };

    getUserDetails();
  }, [loggedIn]);

  const handleLogin = async (
    username: string,
    password: string,
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    if (username && password) {
      const response = await axios.post("/api/login", {
        username,
        password,
      });

      const { loggedIn } = response.data;

      if (loggedIn) {
        setLoading(false);
        setLoggedIn(true);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Buddy, Empathetic Chatdog</title>
        </Head>
        <div className="buddyBody">
          <Header />
          <p>Loading...</p>
          <Footer />
        </div>
      </>
    );
  }

  if (username) {
    return (
      <>
        <Head>
          <title>Buddy, Empathetic Chatdog</title>
        </Head>
        <div className="buddyBody">
          <Header />
          <Chatbox userName={username} loggedIn={loggedIn} />
          <Footer />
        </div>
      </>
    );
  }

  return (
    <div className="buddyBody">
      <Header />
      <LoginForm handleLogin={handleLogin} />;
      <Footer />
    </div>
  );
};

export default Home;

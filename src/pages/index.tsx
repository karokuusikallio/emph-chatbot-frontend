import { type NextPage } from "next";
import { useState, FormEvent, useEffect } from "react";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbox from "../components/Chatbox";
import LoginForm from "../components/LoginForm";

type HomePageProps = {
  passUsername: (username: string) => void;
};

const Home: NextPage<HomePageProps> = (props: HomePageProps) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get("/api/user/me");
        if (response.data.userName) {
          props.passUsername(response.data.userName);
          setUsername(response.data.userName);
        }
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
      <LoginForm handleLogin={handleLogin} />
      <Footer />
    </div>
  );
};

export default Home;

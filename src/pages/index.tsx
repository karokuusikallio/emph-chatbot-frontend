import { type NextPage } from "next";
import { useState, useEffect } from "react";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbox from "../components/Chatbox";
import { useRouter } from "next/router";

import { NOTIFICATION_TYPE } from "react-notifications-component";

type loadingStates = "idle" | "loading" | "finished";

interface HomePageProps {
  passUsername: (username: string) => void;
  showNotification: (title: string, type: NOTIFICATION_TYPE) => void;
}

const Home: NextPage<HomePageProps> = (props: HomePageProps) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<loadingStates>("idle");

  const router = useRouter();

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading("loading");
      try {
        const response = await axios.get("/api/user/me");
        if (response.data.userName) {
          props.passUsername(response.data.userName);
          setUsername(response.data.userName);
          setLoading("finished");
          return;
        }
        router.push("/login");
      } catch (error) {
        console.log(error);
        setLoading("idle");
      }
    };

    getUserDetails();
  }, []);

  return (
    <>
      <div className="buddyBody">
        <Header />
        <Chatbox userName={username} loading={loading} />
        <Footer />
      </div>
    </>
  );
};

export default Home;

import { type NextPage } from "next";
import { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbox from "../components/Chatbox";
import { useRouter } from "next/router";

import { NOTIFICATION_TYPE } from "react-notifications-component";

type LoadingStates = "idle" | "loading" | "finished";
export type SessionStatus = "idle" | "ongoing" | "ended";

interface HomePageProps {
  passUsername: (username: string) => void;
  showNotification: (title: string, type: NOTIFICATION_TYPE) => void;
}

const Home: NextPage<HomePageProps> = (props: HomePageProps) => {
  const [username, setUsername] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingStates>("idle");
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("idle");

  const router = useRouter();

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading("loading");
      try {
        const response = await axios.get("/api/user/me");
        if (response.data.userName) {
          props.passUsername(response.data.userName);
          setUsername(response.data.userName);

          if (response.data.conversationId) {
            setSessionId(response.data.conversationId);
            setSessionStatus("ongoing");
          }

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

  const getSessionId = async (): Promise<string> => {
    const conversationId = sessionId ?? uuidv4();

    if (sessionId === null) {
      try {
        const response = await axios.post("/api/session", {
          username,
          conversationId,
        });
        setSessionId(response.data.conversationId);
      } catch (error) {
        console.log(error);
      }
    }
    return conversationId;
  };

  const handleEndSession = async (): Promise<void> => {
    try {
      await axios.delete("/api/session", {
        data: {
          username,
        },
      });
      setSessionId(null);
      setSessionStatus("ended");
    } catch (error) {
      console.log(error);
    }
    return;
  };

  return (
    <>
      <div className="buddyBody">
        <Header />
        <Chatbox
          userName={username}
          sessionId={sessionId}
          loading={loading}
          getSessionId={getSessionId}
          handleEndSession={handleEndSession}
          sessionStatus={sessionStatus}
          setSessionStatus={setSessionStatus}
        />
        <Footer />
      </div>
    </>
  );
};

export default Home;

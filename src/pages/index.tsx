import { type NextPage } from "next";
import { useState, FormEvent, useEffect } from "react";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbox from "../components/Chatbox";
import LoginForm from "../components/LoginForm";
import CreateUserForm from "../components/CreateUserForm";
import Togglable from "../components/Togglable";
import { playfairDisplay } from "./_app";

type HomePageProps = {
  passUsername: (username: string) => void;
};

const Home: NextPage<HomePageProps> = (props: HomePageProps) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [createUserFormVisible, setCreateUserFormVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/user/me");
        if (response.data.userName) {
          props.passUsername(response.data.userName);
          setUsername(response.data.userName);
        }
        setLoading(false);
      } catch (error) {
        console.log("Can't connect to server.");
        console.log(error);
        setLoading(false);
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

  const handleCreateNewUser = async (
    username: string,
    password: string,
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (username && password) {
      setCreateUserFormVisible(false);
      setLoading(true);
      try {
        const response = await axios.post("/api/user", {
          username,
          password,
        });
        console.log(`User ${response.data.username} created.`);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

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

  if (loading) {
    return (
      <>
        <div className="buddyBody">
          <Header />
          <div className="buddyBackgroundImage">
            <div className="buddyLoginPage buddyLoadingPage">
              <div className="lds-heart">
                <div></div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <div className="buddyBody">
      <Header />
      <div className="buddyBackgroundImage">
        <div className="buddyLoginPage">
          <h1 className={playfairDisplay.className}>
            Buddy is a loyal companion that you can tell about your day. You can
            share the ups and downs confidentially and Buddy will try his best
            to give you a supportive answer. Log in or make a new account.
          </h1>
          <LoginForm
            visibility={!createUserFormVisible}
            handleLogin={handleLogin}
          />
          <Togglable
            visible={createUserFormVisible}
            setVisibility={setCreateUserFormVisible}
            buttonLabel="Create New User"
          >
            <CreateUserForm handleCreateNewUser={handleCreateNewUser} />
          </Togglable>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

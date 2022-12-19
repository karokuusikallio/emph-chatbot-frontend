import { type NextPage } from "next";
import { useState, FormEvent, useEffect } from "react";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";
import CreateUserForm from "../components/CreateUserForm";
import Togglable from "../components/Togglable";
import { playfairDisplay } from "./_app";
import { useRouter } from "next/router";

import { NOTIFICATION_TYPE } from "react-notifications-component";

interface LoginPageProps {
  showNotification: (title: string, type: NOTIFICATION_TYPE) => void;
}

const Home: NextPage<LoginPageProps> = (props: LoginPageProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [createUserFormVisible, setCreateUserFormVisible] =
    useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get("/api/user/me");
        if (response.data.userName) {
          router.push("/");
          return;
        }
      } catch (error) {
        console.log("Can't connect to server.");
        console.log(error);
      }
    };

    getUserDetails();
  }, []);

  const handleLogin = async (
    username: string,
    password: string,
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    if (username && password) {
      try {
        const response = await axios.post("/api/login", {
          username,
          password,
        });

        const { loggedIn } = response.data;

        if (loggedIn) {
          router.push("/");
          return;
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          props.showNotification(error.response.data.error, "danger");
        } else {
          console.log(error);
        }
      }
      setLoading(false);
    }
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
        props.showNotification(
          `User ${response.data.username} created.`,
          "success"
        );
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          props.showNotification(error.response.data.error, "danger");
        } else {
          console.log(error);
        }
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="buddyBody">
          <Header />
          <main className="buddyMain">
            <div className="buddyBackgroundImage">
              <div className="buddyLoginPage buddyLoadingPage">
                <div className="lds-heart">
                  <div></div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <div className="buddyBody">
      <Header />
      <main className="buddyMain">
        <div className="buddyBackgroundImage">
          <div className="buddyLoginPage">
            <h1 className={playfairDisplay.className}>
              Buddy is a loyal companion that you can tell about your day. You
              can share the ups and downs confidentially and Buddy will try his
              best to give you a supportive answer. Log in or make a new
              account.
            </h1>
            <LoginForm
              visibility={!createUserFormVisible}
              handleLogin={handleLogin}
            />
            <Togglable
              visible={createUserFormVisible}
              setVisibility={setCreateUserFormVisible}
              buttonLabel="Create New User"
              buttonId="createNewUser"
            >
              <CreateUserForm handleCreateNewUser={handleCreateNewUser} />
            </Togglable>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

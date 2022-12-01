import { type NextPage } from "next";
import Head from "next/head";
import { useState, FormEvent, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import UserIcon from "../components/UserIcon";

interface Message {
  id: string;
  sender: string;
  text: string;
  createdAt: string;
}

const getTimeNow = (): string => {
  const today = new Date();
  const date = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  const dateTime = `${date} ${time}`;
  return dateTime;
};

const Home: NextPage = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [expectAnswer, setExpectAnswer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getBotResponse = async () => {
      let timeout;
      if (expectAnswer) {
        setLoading(true);
        clearTimeout(timeout);
        setUserInput("");
        const result = await axios.get("http://localhost:8000/api/conversate", {
          params: { text: userInput },
        });
        console.log(result.data);
        const botMessage: Message = {
          id: uuidv4(),
          sender: "Buddy",
          text: result.data[0].queryResult.responseMessages[0].text.text[0],
          createdAt: getTimeNow(),
        };

        timeout = setTimeout(() => {
          setMessages(messages.concat(botMessage));
          setLoading(false);
          setExpectAnswer(false);
        }, 2000);
      }
    };

    getBotResponse();
  }, [expectAnswer, messages, userInput]);

  useEffect(() => {
    const chatbox = document.querySelector(".buddyChatbox");
    const messagesEndDiv = document.querySelector(
      "#messagesEnd"
    ) as HTMLElement;
    if (chatbox && messagesEndDiv) {
      chatbox.scrollTo(0, messagesEndDiv.offsetTop);
    }
  }, [messages, loading]);

  const handleUserInput = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage: Message = {
      id: uuidv4(),
      sender: "User",
      text: userInput,
      createdAt: getTimeNow(),
    };

    setExpectAnswer(true);
    setMessages(messages.concat(userMessage));
  };

  return (
    <>
      <Head>
        <title>Buddy, Empathetic Chatdog</title>
      </Head>
      <main className="buddyMain">
        <div className="buddyContainer">
          <div className="buddyChatbox" ref={messagesEndRef}>
            {messages.length > 0
              ? messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.sender === "Buddy"
                        ? "buddyMessageBot"
                        : "buddyMessageUser"
                    }
                  >
                    <div>
                      <UserIcon sender={message.sender} />
                    </div>
                    <div>
                      <p className="buddyTimeStamp">{message.createdAt}</p>
                      <div className="buddyChatBubble">
                        <p>{message.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              : null}
            {loading ? (
              <div className="buddyMessageBot">
                <div>
                  <UserIcon sender="Buddy" />
                </div>
                <div className="buddyChatBubble">
                  <div className="lds-heart">
                    <div></div>
                  </div>
                </div>
              </div>
            ) : null}
            <div id="messagesEnd"></div>
          </div>
          <div className="buddyForm">
            <form onSubmit={handleUserInput}>
              <input
                type="text"
                value={userInput}
                onChange={({ target }) => setUserInput(target.value)}
              ></input>
              <button type="submit" disabled={!userInput}>
                SEND
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

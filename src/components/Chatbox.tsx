import { useState, FormEvent, useEffect, useRef } from "react";
import axios from "axios";

import UserIcon from "../components/UserIcon";

interface Message {
  sender: string;
  text: string;
  createdAt: string;
  id: string;
}

interface ChatboxProps {
  userName: string | null;
  loggedIn: boolean;
}

const Chatbox = (props: ChatboxProps) => {
  const [userInput, setUserInput] = useState<string>("");
  const [expectAnswer, setExpectAnswer] = useState<boolean>(false);
  const [writing, setWriting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messageTimeToLocal = (message: Message) => {
    const localDate = new Date(message.createdAt);
    return { ...message, createdAt: localDate.toLocaleString() };
  };

  useEffect(() => {
    const getMessages = async () => {
      if (props.userName) {
        const response = await axios.get("/api/messages");
        if (response.data.length > 0) {
          const messagesTimeToLocal = response.data.map((message: Message) => {
            return messageTimeToLocal(message);
          });

          setMessages(messagesTimeToLocal);
        }
      }
    };
    getMessages();
  }, [props.userName, expectAnswer]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const getBotResponse = async () => {
      if (expectAnswer) {
        setWriting(true);
        clearTimeout(timeout);
        const responseFromConversate = await axios.get("/api/conversate", {
          params: { text: userInput },
        });

        const botMessage = {
          sender: "BOT",
          text: responseFromConversate.data[0].queryResult.responseMessages[0]
            .text.text[0],
        };

        const response = await axios.post("/api/messages", botMessage);

        const messageWithLocalTime = messageTimeToLocal(
          response.data as Message
        );
        const newMessages = messages.concat(messageWithLocalTime);

        timeout = setTimeout(() => {
          setMessages(newMessages);
          setWriting(false);
          setExpectAnswer(false);
        }, 2000);
      }
    };
    getBotResponse();
  }, [expectAnswer]);

  useEffect(() => {
    const chatbox = document.querySelector(".buddyChatbox");
    const messagesEndDiv = document.querySelector(
      "#messagesEnd"
    ) as HTMLElement;
    if (chatbox && messagesEndDiv) {
      chatbox.scrollTo(0, messagesEndDiv.offsetTop);
    }
  }, [messages, writing]);

  let timeoutForUserInput: NodeJS.Timeout;

  const handleUserInput = async (e: FormEvent<HTMLFormElement>) => {
    clearTimeout(timeoutForUserInput);
    e.preventDefault();
    const userMessage = {
      sender: "USER",
      text: userInput,
    };

    const response = await axios.post("/api/messages", userMessage);

    const messageWithLocalTime = messageTimeToLocal(response.data as Message);
    const newMessages = messages.concat(messageWithLocalTime);

    setMessages(newMessages);
    setUserInput("");

    timeoutForUserInput = setTimeout(() => {
      setExpectAnswer(true);
    }, 2000);
  };

  return (
    <main className="buddyMain">
      <div className="buddyContainer">
        <div className="buddyChatbox" ref={messagesEndRef}>
          {messages.length > 0
            ? messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.sender === "BOT"
                      ? "buddyMessageBot"
                      : "buddyMessageUser"
                  }
                >
                  <UserIcon sender={message.sender} />
                  <div>
                    <p className="buddyTimeStamp">
                      {message.createdAt.toLocaleString()}
                    </p>
                    <div className="buddyChatBubble">
                      <p>{message.text}</p>
                    </div>
                  </div>
                </div>
              ))
            : null}
          {writing ? (
            <div className="buddyMessageBot">
              <UserIcon sender="BOT" />
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
            <button type="submit" className="buddyButton" disabled={!userInput}>
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Chatbox;

import { useState, FormEvent, useEffect, useRef } from "react";
import axios from "axios";

import UserIcon from "../components/UserIcon";

interface Message {
  sender: string;
  text: string;
  createdAt: Date;
  timestamp?: string;
}

type loadingStates = "idle" | "loading" | "finished";

interface ChatboxProps {
  userName: string | null;
  loading: loadingStates;
}

const Chatbox = (props: ChatboxProps) => {
  const [userInput, setUserInput] = useState<string>("");
  const [writing, setWriting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  let timeout: NodeJS.Timeout;

  const messageTimeToLocal = (message: Message): Message => {
    const localDate = new Date(message.createdAt);
    return { ...message, timestamp: localDate.toLocaleString() };
  };

  useEffect(() => {
    const getMessages = async () => {
      if (props.loading === "finished") {
        const response = await axios.get("/api/messages");
        if (response.data.length > 0) {
          const messagesTimeToLocal = response.data.map((message: Message) => {
            return messageTimeToLocal(message);
          });

          setMessages(messagesTimeToLocal);
        }
        setLoading(false);
      }
    };
    getMessages();
  }, [props.loading]);

  useEffect(() => {
    const chatbox = document.querySelector(".buddyChatbox");
    const messagesEndDiv = document.querySelector(
      "#messagesEnd"
    ) as HTMLElement;
    if (chatbox && messagesEndDiv) {
      chatbox.scrollTo(0, messagesEndDiv.offsetTop);
    }
  }, [messages, writing]);

  const handleUserInput = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage = {
      sender: "USER",
      text: userInput,
      createdAt: new Date(),
    };

    const userMessageWithLocalTime = messageTimeToLocal(userMessage);
    const updatedMessages = [...messages, userMessageWithLocalTime];
    setMessages(updatedMessages);
    setUserInput("");

    try {
      await axios.post("/api/messages", userMessage);
    } catch (error) {
      console.log(error);
    }

    return getBotResponse(updatedMessages);
  };

  const getBotResponse = async (updatedMessages: Message[]) => {
    setWriting(true);
    clearTimeout(timeout);

    let latestMessage: string | undefined;
    if (updatedMessages.length > 0) {
      latestMessage = updatedMessages.at(-1)?.text;
    }

    try {
      const responseFromConversate = await axios.get("/api/conversate", {
        params: { text: latestMessage },
      });

      if (
        responseFromConversate.data[0].queryResult.responseMessages[0].text
          .text[0]
      ) {
        const botMessage = {
          sender: "BOT",
          text: responseFromConversate.data[0].queryResult.responseMessages[0]
            .text.text[0],
          createdAt: new Date(),
        };

        const botMessageWithLocalTime = messageTimeToLocal(botMessage);
        const newMessages = updatedMessages.concat(botMessageWithLocalTime);

        timeout = setTimeout(async () => {
          setMessages(newMessages);
          setWriting(false);

          try {
            await axios.post("/api/messages", botMessage);
          } catch (error) {
            console.log(error);
          }

          return;
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="buddyMain">
      <div className="buddyContainer">
        <div className="buddyChatbox" ref={messagesEndRef}>
          {loading ? (
            <div className="lds-heart">
              <div></div>
            </div>
          ) : messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.sender === "BOT"
                    ? "buddyMessageBot"
                    : "buddyMessageUser"
                }
              >
                <UserIcon sender={message.sender} />
                <div>
                  <p className="buddyTimeStamp">{message.timestamp}</p>
                  <div className="buddyChatBubble">
                    <p>{message.text}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#2b2d42" }}>
              Don&apos;t be shy, write something!
            </p>
          )}
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
              id="userInput"
            ></input>
            <button
              type="submit"
              className="buddyButton"
              disabled={!userInput}
              id="messageSendButton"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Chatbox;

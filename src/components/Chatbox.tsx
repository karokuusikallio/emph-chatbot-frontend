import { useState, FormEvent, useEffect, useRef } from "react";
import axios from "axios";

import UserIcon from "../components/UserIcon";
import type { SessionStatus } from "../pages/index";

interface Message {
  sender: string;
  text: string;
  createdAt: Date;
  timestamp?: string;
}

type loadingStates = "idle" | "loading" | "finished";

interface ChatboxProps {
  userName: string | null;
  sessionId: string | null;
  loading: loadingStates;
  getSessionId: () => Promise<string>;
  handleEndSession: () => Promise<void>;
  sessionStatus: SessionStatus;
  setSessionStatus: (status: SessionStatus) => void;
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
  }, [props.loading, props.sessionId]);

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
    props.setSessionStatus("ongoing");
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

    const conversationId = await props.getSessionId();

    let latestMessage: string | undefined;
    if (updatedMessages.length > 0) {
      latestMessage = updatedMessages.at(-1)?.text;
    }

    try {
      const conversateParams = {
        text: latestMessage,
        sessionId: conversationId,
      };
      const responseFromConversate = await axios.get("/api/conversate", {
        params: conversateParams,
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
          ) : null}
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
          {props.sessionId && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                className="buddyButton endSessionButton"
                onClick={async () => await props.handleEndSession()}
              >
                End Session
              </button>
            </div>
          )}
          {props.sessionStatus === "ended" && (
            <div>
              <p
                style={{
                  textAlign: "center",
                  color: "#2b2d42",
                  padding: "2rem",
                }}
              >
                --- SESSION ENDED ---
              </p>
            </div>
          )}
          {props.sessionStatus === "idle" && (
            <div>
              <p
                style={{
                  textAlign: "center",
                  color: "#2b2d42",
                  padding: "2rem",
                }}
              >
                --- START A NEW CONVERSATION ---
              </p>
            </div>
          )}
          <div id="messagesEnd"></div>
        </div>
        <div className="buddyForm">
          <form onSubmit={handleUserInput}>
            <input
              type="text"
              value={userInput}
              onChange={({ target }) => setUserInput(target.value)}
              id="userInput"
              autoComplete="off"
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

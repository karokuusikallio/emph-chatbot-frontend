import { type NextPage } from "next";
import Head from "next/head";
import { useState, FormEvent } from "react";
import axios from "axios";

const Home: NextPage = () => {
  const [query, setQuery] = useState<string>("");
  const [fulfillmentText, setFulFillmentText] = useState<string>("");

  const handleAnalyze = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await axios.get("http://localhost:8000/api/conversate", {
        params: { text: query },
      });
      console.log(result.data);
      setFulFillmentText(
        result.data[0].queryResult.responseMessages[0].text.text[0]
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Buddy, Empathetic Chatdog</title>
      </Head>
      <main className="buddyMain">
        <div className="buddyContainer">
          <div className="buddyChatbox">
            <p>{fulfillmentText ?? fulfillmentText}</p>
          </div>
          <div className="buddyForm">
            <form onSubmit={handleAnalyze}>
              <input
                type="text"
                value={query}
                onChange={({ target }) => setQuery(target.value)}
              ></input>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

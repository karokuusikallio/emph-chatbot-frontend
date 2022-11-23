import { type NextPage } from "next";
import Head from "next/head";
import { useState, FormEvent } from "react";
import axios from "axios";

const Home: NextPage = () => {
  const [query, setQuery] = useState<string>("");

  const handleAnalyze = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await axios.get("http://localhost:8000/api/recognize", {
        params: { text: query },
      });
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Emphatetic Chatbot</title>
      </Head>
      <main>
        <h1>Emphatetic Chatbot</h1>
        <form onSubmit={handleAnalyze}>
          <label>Text to Analyze</label>
          <input
            type="text"
            value={query}
            onChange={({ target }) => setQuery(target.value)}
          ></input>
          <button type="submit">Analyze</button>
        </form>
      </main>
    </>
  );
};

export default Home;

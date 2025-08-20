import { useState } from "react";
import axios from "axios";
// import "./Home.css";

export default function Home() {
  const [value, updateValue] = useState("create new data");
  const [input, setInput] = useState("");
  const baseUrl = "http://localhost:5001";

  const getData = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/data`);
      updateValue(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createData = async (evt) => {
    evt.preventDefault();
    try {
      await axios.post(`${baseUrl}/create`, { data: input });
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="app-container">
      <section className="card">
        <h2 className="title">🚀 My Docker Project </h2>
        <h4 className="Author">🚀 By Sudip </h4>

        <form onSubmit={createData} className="form">
          <input
            type="text"
            placeholder="Please write something"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn primary">Insert</button>
        </form>

        <button onClick={getData} className="btn secondary">Get Data</button>

        <p className="info">
          Try creating data and then click <b>"Get Data"</b> twice to see caching in action.
        </p>

        <div className="output">
          <pre>{JSON.stringify(value, null, 2)}</pre>
        </div>
      </section>
    </main>
  );
}

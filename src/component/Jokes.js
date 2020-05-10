import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import uuid from "uuid/v4";

import "./Jokes.css";

const URL_API = "https://icanhazdadjoke.com/";
export default class Jokes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
      loading: false,
    };
    this.seenJokes = new Set(this.state.jokes.map((j) => j.text));
    console.log(this.seenJokes);
    this.handleClick = this.handleClick.bind(this);
    this.handleVotes = this.handleVotes.bind(this);
  }
  componentDidMount() {
    //FETCH DATA THE FIRST TIME
    if (this.state.jokes.length === 0) this.fetchJokes();
  }

  async fetchJokes() {
    try {
      let newJokes = [];
      while (newJokes.length < 10) {
        let res = await axios.get(URL_API, {
          headers: { Accept: "application/json" },
        });
        if (!this.seenJokes.has(res.data["joke"])) {
          console.log("NOT AVAILABLE");
          newJokes.push({
            id: uuid(),
            text: res.data["joke"],
            votes: 0,
          });
        } else console.log("AVAILABLE");
      }
      this.setState((st) => ({
        loading: false,
        jokes: [...st.jokes, ...newJokes],
      }));

      window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes));
    } catch (e) {
      alert(e);
      this.setState({ loading: false });
    }
  }

  handleVotes(id, delta) {
    this.setState(
      (st) => ({
        jokes: st.jokes.map((j) =>
          j.id === id ? { ...j, votes: j.votes + delta } : j
        ),
      }),
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }

  handleClick() {
    this.setState({ loading: true }, this.fetchJokes);
    // this.seenJokes.clear();
    //  this.seenJokes.add(this.state.jokes.map((j) => j.id).getItem();
    //  console.log(this.seenJokes);
  }

  orderJokes() {}
  render() {
    if (this.state.loading) {
      return (
        <div className="Jokes-spinner">
          <i className="far fa-8x fa-laugh fa-spin" />
          <h1 className="JokeList-title">Loading...</h1>
        </div>
      );
    }
    let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
    return (
      <div className="Jokes">
        <div className="Jokes-sidebar">
          <h1 className="Jokes-title">
            <span>Dad</span> Jokes
          </h1>
          <img
            alt="logo"
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
          />
          <button className="Jokes-getmore" onClick={this.handleClick}>
            New Jokes
          </button>
        </div>

        <div className="Jokes-list">
          {jokes.map((j) => (
            <Joke
              downVote={() => this.handleVotes(j.id, -1)}
              upVote={() => this.handleVotes(j.id, 1)}
              votes={j.votes}
              text={j.text}
              key={j.id}
              id={j.id}
            />
          ))}
        </div>
      </div>
    );
  }
}

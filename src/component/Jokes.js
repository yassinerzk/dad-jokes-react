import React, { Component } from "react";
import axios from "axios";

const URL_API = "https://icanhazdadjoke.com/";
export default class Jokes extends Component {
  constructor(props) {
    super(props);
    this.state = { jokes: [] };
    this.fetchJokes = this.fetchJokes.bind(this);
  }
  async componentDidMount() {
    //FETCH DATA THE FIRST TIME
    await this.fetchJokes();
  }

  async fetchJokes() {
    let newJokes = [];
    while (newJokes.length < 10) {
      let res = await axios.get(URL_API, {
        headers: { Accept: "application/json" },
      });
      let joke = { id: res.data["id"], joke: res.data["joke"] };
      newJokes.push(joke);
    }

    this.setState({ jokes: newJokes });
  }
  render() {
    return (
      <div>
        <h1>Jokes List</h1>
        <div className="jokes">
          {this.state.jokes.map((j) => (
            <div>{j.joke}</div>
          ))}
        </div>
      </div>
    );
  }
}

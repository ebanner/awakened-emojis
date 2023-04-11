import React from 'react';
import { Link } from 'react-router-dom';

import TitleBar from '../../components/index.js';

import './index.css'

import 'bootstrap/dist/css/bootstrap.min.css';

class UsersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      numEmojisToShow: null,
    }
  }

  handleClick(user) {
    const numEmojisToShow = {
      ...this.state.numEmojisToShow,
      [user]: this.state.numEmojisToShow[user] + 50,
    }

    this.setState({
      ...this.state,
      numEmojisToShow: numEmojisToShow,
    });

  }

  componentDidMount() {
    var data = require('./kings.json');

    // Only take a slice of the first 5 items in the list for every key
    const numEmojisToShow = {};
    for (var key in data) {
      // data[key] = data[key].slice(0, 5);
      numEmojisToShow[key] = 7;
    }

    this.setState({
      data: data,
      numEmojisToShow: numEmojisToShow
    });
  }

  render() {
    if (!this.state.data) {
      return null;
    }

    return (
      <div>
        <TitleBar />
        <div class="users-page-body">
          <div class="users-header">
            <h1>Users</h1>
          </div>
          <p>Emojis under your name are emojis where you are the #1 user of that emoji</p>
          <p>Data snapshot is from 2016-04-04 to 2022-10-24</p>
          <p>Click into emojis to see a detailed page for them</p>
          {/* <pre>
            {JSON.stringify(this.state.data["Leo Pokatu"], null, 2)}
          </pre> */}
          {Object.keys(this.state.data).map((user, index) => (
            <>
              <div class="user-chunk">
                <h4>{user}</h4>
                {this.state.data[user].slice(0, this.state.numEmojisToShow[user]).map((emoji, index) => (
                  // Link to emoji page

                  <Link to={`/emoji/${emoji.name}`}>
                    {emoji.type == "custom" ?
                      <img
                        src={emoji.url}
                        width="32"
                      />
                      :
                      <span /* Make the text size bigger */
                        style={{ fontSize: "32px" }}
                      >{emoji.emoji}</span>}
                  </Link>
                ))}
                {
                  /* Only show the button if there are more emojis left to show */
                  this.state.data[user].length > this.state.numEmojisToShow[user] &&
                  <span style={{ paddingLeft: "10px" }}>
                    <button onClick={() => this.handleClick(user)}>...</button>
                  </span>
                }
              </div>
            </>
          ))}
          {/* <h1>Users</h1>
          <pre>
            {JSON.stringify(this.state.data, null, 2)}
          </pre> */}
        </div>
      </div>
    )
  }
}

export default UsersPage;
import React from 'react';
import { Link } from 'react-router-dom';

import TitleBar from '../../components/index.js';

import './index.css'

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
      [user]: this.state.numEmojisToShow[user] + 5,
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
    if (! this.state.data) {
        return null;
    }
    return (
      <div>
        <TitleBar />
        <div class="users-page-body">
            <h1>Users</h1>
            {Object.keys(this.state.data).map((user, index) => (
                <>
                  <h2>{user}</h2>
                  {this.state.data[user].slice(0, this.state.numEmojisToShow[user]).map((emoji, index) => (
                    // Link to emoji page
                    <Link to={`/emoji/${emoji.name}`}>
                      <img
                        src={emoji.url}
                        width="32"
                      />
                    </Link>
                  ))}
                  <span style={{paddingLeft: "10px"}}>
                    <button onClick={() => this.handleClick(user)}>...</button>
                  </span>
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
import React, { Component, useRef, useState } from 'react';

import './index.css';

import TitleBar from '../../components/index.js';

import { useParams, Link, BrowserRouter as Router } from 'react-router-dom';


const EmojiImages = (props) => {
  const { emojiList } = props;

  const [numEmojisToShow, setNumEmojisToShow] = React.useState(6);

  const handleClick = () => {
    setNumEmojisToShow(numEmojisToShow * 2);
  }

  return (
    <>
      {
        emojiList.slice(0, numEmojisToShow).map((emoji) =>
          <Link to={`/emojis/${emoji.name}`}>
            {'url' in emoji ?
              <img
                src={emoji.url}
                width="32"
                title={emoji.name}
              />
              :
              emoji.emoji != null ?
                <span style={{ fontSize: "32px" }} title={emoji.name}>{emoji.emoji}</span>
                :
                <span style={{ fontSize: "16px" }} title={emoji.name}>{emoji.name}</span>}
          </Link>
        )
      }
      {numEmojisToShow <= emojiList.length &&
        <span style={{ paddingLeft: "10px" }}>
          <button onClick={handleClick}>...</button>
        </span>
      }
    </>
  )
};


class UserPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  fetchData() {
    const user = this.state.user;

    const API_HOSTNAME = 'https://hrciqioroiwbp5urkjrfrfytkm0ztjwo.lambda-url.us-east-1.on.aws'
    // const API_HOSTNAME = 'http://localhost:5001'

    // fetch(`${API_HOSTNAME}/${emoji}/usage`)
    //   .then(response => response.json())
    //   .then(data => this.setState({ usage: processUsage(data.usage) }));
  }

  componentDidMount() {
    this.fetchData();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.setState({
        user: this.props.user,
        numEmojisToShow: 6,
      }, () => {
        this.fetchData();
      });
    }
    // console.log('updated!', prevProps, this.props);
  }

  render() {
    // const {
    //   user
    // } = this.state;

    const user = 'Eddie';

    return (
      // emoji object as a <pre> element
      <div>
        <TitleBar />
        <div class="body container">
          <div class="name mt-4">
            <h1>{user}</h1>
          </div>
          <div class="mt-5">
            <div class="row g-5">
              <h2>Emojis Uploaded</h2>
              <div style={{ width: '100%' }}>
                <p>...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  }
}


function UserPageWrapper() {
  const { user } = useParams();
  return <UserPage user={user} />;
}


export default UserPageWrapper
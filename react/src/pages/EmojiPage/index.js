import React, { Component } from 'react';

import './index.css';

import TitleBar from '../../components/index.js';

import { useParams } from 'react-router-dom';


class EmojiPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      emojiName: props.emojiName,
    };
  }

  componentDidMount() {
    const data = require('./emojis-to-channels-and-users.json');

    // Set data to the state
    // this.setState({ data: data });

    // const emoji = Object.entries(data)[0];
    const metadata = data[this.state.emojiName];

    this.setState({ metadata: metadata });
  }

  render() {
    if (!this.state.metadata) {
      return null;
    }

    const { emojiName, metadata } = this.state;

    // Get the first element from data

    // console.log('emoji');
    // console.log(emoji);

    // console.log(metadata);

    // Print out metadata
    console.log('metadata');
    console.log(metadata);

    console.log('emoji_url');
    console.log(metadata.url);

    return (
      // emoji object as a <pre> element
      <>
        <TitleBar />
        <div
          // className={styles.emojiPage}
          class="emoji-page-body"
        >
          <h1><pre>:{emojiName}:</pre></h1>
          <img
            src={metadata.url}
            alt={emojiName}
            width="64"
          />
          {/* <pre
            // className={styles.emojiPage}
          >
            {JSON.stringify(metadata, null, 2)}
          </pre> */}
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {metadata.users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Channels</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {metadata.channels.map((channel, index) => (
                <tr key={index}>
                  <td>{channel.name}</td>
                  <td>{channel.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )

  }
}


function EmojiPageWrapper() {
  const { emojiName } = useParams();
  return <EmojiPage emojiName={emojiName} />;
}


export default EmojiPageWrapper
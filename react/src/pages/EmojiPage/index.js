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
    const data = require('./emojis-to-channels-and-users-with-upload-info-and-popularity.json');

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
        <div class="emoji-page-body">
          <div class="emoji-header">
            <h1><pre>:{emojiName}:</pre></h1>
          </div>
          <div class="main-emoji">
            {metadata.type == 'custom' ?
              <img
                src={metadata.url}
                alt={emojiName}
                width="64"
              />
              :
              <p
                style={{ fontSize: "48px" }}
              >{metadata.emoji}
              </p>
            }
          </div>
          {/* <pre
            // className={styles.emojiPage}
          >
            {JSON.stringify(metadata, null, 2)}
          </pre> */}
          {(metadata.type == 'custom') && 
            <>
            <br />
            <h2>History</h2>
            <ul>
              <li><code>{emojiName}</code> was uploaded by <b>{metadata.added_by}</b> on {metadata.date_added}.</li>
              <li>It is the <b>{metadata.popularity}</b> most popular emoji.</li>
            </ul>
            <br></br>
            </>}
          {console.log(metadata)}
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
          <div class="channels-section">
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
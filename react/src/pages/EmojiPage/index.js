import React, { Component } from 'react';

import { Helmet } from 'react-helmet';

import './index.css';

import TitleBar from '../../components/index.js';

import { useParams, Link, BrowserRouter as Router } from 'react-router-dom';


const EmojiImages = (props) => {
  const { emojiList, data } = props;

  return (
    emojiList.slice(0, 6).map((emoji) =>
      emoji in data &&
      <Link to={`/emojis/${emoji}`}>
        {data[emoji].type == "custom" ?
          <img
            src={data[emoji].url}
            width="32"
          />
          :
          data[emoji].emoji != null ?
            <span style={{ fontSize: "32px" }}>{data[emoji].emoji}</span>
            :
            <span style={{ fontSize: "16px" }}>{data[emoji].name}</span>}
      </Link>
    ));
};


class EmojiPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      emojiName: props.emojiName,
    };
  }

  componentDidMount() {
    const data = require('./emojis-to-channels-and-users-with-upload-info-and-popularity-and-related.json');

    // Set data to the state
    // this.setState({ data: data });

    // const emoji = Object.entries(data)[0];
    const metadata = data[this.state.emojiName];

    this.setState({
      metadata: metadata,
      data: data,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.emojiName !== prevProps.emojiName) {
      const metadata = this.state.data[this.props.emojiName];
      this.setState({
        emojiName: this.props.emojiName,
        metadata: metadata
      });
    }
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
    // console.log('metadata');
    // console.log(metadata);

    // console.log('emoji_url');
    // console.log(metadata.url);

    const descriptionText = (metadata.type == 'custom') ?
      `${emojiName} was uploaded by ${metadata.added_by} on ${metadata.date_added}. It is the ${metadata.popularity} most popular emoji.`
      :
      `${emojiName} is the ${metadata.popularity} most popular emoji.`

    return (
      // emoji object as a <pre> element
      <div>
        <Helmet>
          <title>Custom Title for This Route</title>
          <meta property="og:title" content={emojiName} />
          <meta property="og:description" content={descriptionText} />
          {metadata.type == 'custom' && <meta property="og:image" content={metadata.url} />}
        </Helmet>
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
          <br />
          <h2>History</h2>
          <ul>
            {(metadata.type == 'custom') ?
              <>
                <li><code>{emojiName}</code> was uploaded by <b>{metadata.added_by}</b> on {metadata.date_added}.</li>
                <li>It is the <b>{metadata.popularity}</b> most popular emoji.</li>
              </>
              :
              <li><code>{emojiName}</code> is the <b>{metadata.popularity}</b> most popular emoji.</li>}
          </ul>
          <br />
          <h2>Related Emojis</h2>
          <EmojiImages data={this.state.data} emojiList={metadata.related} />
          <br />
          <br />
          <br />
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
      </div>
    )

  }
}


function EmojiPageWrapper() {
  const { emojiName } = useParams();
  return <EmojiPage emojiName={emojiName} />;
}


export default EmojiPageWrapper
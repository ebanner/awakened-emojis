import React, { Component, useRef } from 'react';

import './index.css';

import TitleBar from '../../components/index.js';

import { useParams, Link, BrowserRouter as Router } from 'react-router-dom';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components with Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ emojiName, labels, dataPoints }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: emojiName,
        data: dataPoints,
        fill: false,
        borderColor: 'rgba(66, 135, 245, 0.6)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};



const EmojiImages = (props) => {
  const { emojiList } = props;

  return (
    emojiList.slice(0, 6).map((emoji) =>
      <Link to={`/emojis/${emoji.name}`}>
        {emoji.type == "custom" ?
          <img
            src={emoji.url}
            width="32"
          />
          :
          emoji.emoji != null ?
            <span style={{ fontSize: "32px" }}>{emoji.emoji}</span>
            :
            <span style={{ fontSize: "16px" }}>{emoji.name}</span>}
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

  async componentDidMount() {
    const response = await fetch(`http://localhost:5001/${this.state.emojiName}`);
    const metadata = await response.json();

    console.log(metadata);

    const resp = await fetch(`http://localhost:5001/${this.state.emojiName}`);
    const usage = await resp.json();

    var date;
    for (var i = 0; i < metadata.usage.length; i++) {
      date = new Date(metadata.usage[i].ts * 1000);
      metadata.usage[i].date = date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit' });
    }

    this.setState({ metadata: metadata });
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

    const usage = metadata.usage;

    // Get the first element from data

    // console.log('emoji');
    // console.log(emoji);

    // console.log(metadata);

    // Print out metadata
    // console.log('metadata');
    // console.log(metadata);

    // console.log('emoji_url');
    // console.log(metadata.url);

    console.log('related', metadata.related);

    const descriptionText = (metadata.type == 'custom') ?
      `${emojiName} was uploaded by ${metadata.added_by} on ${metadata.date_added}. It is the ${metadata.popularity} most popular emoji.`
      :
      `${emojiName} is the ${metadata.popularity} most popular emoji.`


    const labels = usage.map(use => use.date);
    const dataPoints = usage.map(use => use.count);

    return (
      // emoji object as a <pre> element
      <div>
        <TitleBar />
        <div class="body container">
          <div class="name mt-4">
            <h1><pre>:{emojiName}:</pre></h1>
          </div>
          <div class="emoji mt-4 pt-2">
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
          <div class="mt-5">
            <div class="row g-1">
              <div class="col-lg-6">
                <div class="history">
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
                </div>
                <div class="related mt-4 pt-2">
                  <h2>Related Emojis</h2>
                  <EmojiImages emojiList={metadata.related} />
                </div>
                <div class="usage col-lg-12 d-none mt-4 pt-2 d-none d-sm-block d-md-none">
                  <h2>Usage</h2>
                  <div style={{ width: '100%' }}>
                    <LineChart emojiName={emojiName} labels={labels} dataPoints={dataPoints} />
                  </div>
                </div>
                <div class="box" style={{ "display": "flex", gap: "100px" }}>
                  <div class="users mt-4 pt-4" style={{ gap: "100px" }}>
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
                  </div>
                  <div class="channels mt-4 pt-4">
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
              <div class="usage col-lg-6 d-none d-md-block">
                <h2>Usage</h2>
                <div style={{ width: '100%' }}>
                  <LineChart emojiName={emojiName} labels={labels} dataPoints={dataPoints} />
                </div>
              </div>
              <div class="row">

              </div>
            </div>
          </div>
          <div class="column">


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
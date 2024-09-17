import React, { Component, useRef, useState } from 'react';

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


function processUsage(usage) {
  var date;
  for (var i = 0; i < usage.length; i++) {
    date = new Date(usage[i].ts * 1000);
    usage[i].date = date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit' });
  }
  return usage;
}


class EmojiPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      metatdata: null,
      emojiName: props.emojiName,
      usage: [],
      channels: [],
      users: [],
      numEmojisToShow: 6,
    };
  }

  fetchData() {
    const emoji = this.state.emojiName;

    const API_HOSTNAME = 'https://hrciqioroiwbp5urkjrfrfytkm0ztjwo.lambda-url.us-east-1.on.aws'
    // const API_HOSTNAME = 'http://localhost:5001'

    // Do a fetch and use a callback to process the response - don't use await
    fetch(`${API_HOSTNAME}/${emoji}/usage`)
      .then(response => response.json())
      .then(data => this.setState({ usage: processUsage(data.usage) }));

    fetch(`${API_HOSTNAME}/${emoji}/related`)
      .then(response => response.json())
      .then(data => this.setState({ related: data.related }));

    fetch(`${API_HOSTNAME}/${emoji}/users_and_channels`)
      .then(response => response.json())
      .then(data => this.setState({ channels: data.channels, users: data.users }));

    fetch(`${API_HOSTNAME}/${emoji}/popularity`)
      .then(response => response.json())
      .then(data => this.setState({ popularity: data.popularity }));

    fetch(`${API_HOSTNAME}/${emoji}/upload_data`)
      .then(response => response.json())
      .then(data => this.setState({ date_added: data.date_added, added_by: data.added_by }));

    fetch(`${API_HOSTNAME}/${emoji}/basic_info`)
      .then(response => response.json())
      .then(data => this.setState({ basicInfo: data }));
  }

  componentDidMount() {
    this.fetchData();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.emojiName !== prevProps.emojiName) {
      this.setState({
        emojiName: this.props.emojiName,
        numEmojisToShow: 6,
      }, () => {
        this.fetchData();
      });
    }
    // console.log('updated!', prevProps, this.props);
  }

  render() {
    const {
      emojiName,
      usage,
      channels,
      users,
      date_added,
      added_by,
      popularity,
      related,
      basicInfo,
      numEmojisToShow,
    } = this.state;

    console.log('usage', usage);

    console.log('popularity', popularity);

    console.log('related', related);

    // console.log('date_added', date_added);

    const labels = usage.map(use => use.date);
    const dataPoints = usage.map(use => use.count);

    console.log('basicInfo', basicInfo);

    return (
      // emoji object as a <pre> element
      <div>
        <TitleBar />
        <div class="body container">
          <div class="name mt-4">
            <h1><pre>:{emojiName}:</pre></h1>
          </div>
          {basicInfo && <div class="emoji mt-4 pt-2">
            {'url' in basicInfo ?
              <img
                src={basicInfo.url}
                alt={emojiName}
                width="64"
              />
              :
              <p
                style={{ fontSize: "48px" }}
              >{basicInfo.emoji}
              </p>
            }
          </div>}
          <div class="mt-5">
            <div class="row g-5">
              <div class="col-lg-6">
                {basicInfo && <div class="history">
                  <h2>History</h2>
                  <ul>
                    {(added_by && popularity && date_added) ?
                      <>
                        {added_by && date_added && <li><code>{emojiName}</code> was uploaded by <b>{added_by}</b> on {date_added}.</li>}
                        <li>It is the <b>{popularity}</b> most popular emoji.</li>
                      </>
                      :
                      <li><code>{emojiName}</code> is the <b>{popularity}</b> most popular emoji.</li>}
                  </ul>
                </div>}
                {related && <div class="related mt-4 pt-2">
                  <h2>Related Emojis</h2>
                  <EmojiImages emojiList={related} key={emojiName} />
                </div>}
                <div class="usage col-lg-12 mt-4 pt-2 d-sm-block d-md-none">
                  <h2>Usage</h2>
                  {usage.length > 0 ?
                    <div style={{ width: '100%' }}>
                      <LineChart emojiName={emojiName} labels={labels} dataPoints={dataPoints} />
                    </div>
                    :
                    <p>Loading...</p>
                  }
                </div>
                <div class="box mt-4 pt-4 ms-2 me-2 mb-4" style={{ "display": "flex", "justify-content": "space-between", gap: "50px" }}>
                  <div class="users">
                    <h2>Users</h2>
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users && users.map((user, index) => (
                          <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div class="channels">
                    <h2>Channels</h2>
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {channels && channels.map((channel, index) => (
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
                {usage.length > 0 ?
                  <div style={{ width: '100%' }}>
                    <LineChart emojiName={emojiName} labels={labels} dataPoints={dataPoints} />
                  </div>
                  :
                  <p>Loading...</p>
                }
              </div>
            </div>
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
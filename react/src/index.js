import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';

import './index.css';

import data from './just-custom-emojis-and-popularity.json';
data.sort(function(a, b) {
  return b.count - a.count;
});
data = data.slice(0, 66-1);

// <head>

function Head() {
  return (
    <Helmet>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous" />
    </Helmet>
  );
}

function Bootstrap() {
  return <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
}

// Cells

function TitleBar() {
  return (
    <div class="title-bar">
      <div class="title-bar-text">🔎 #awakened Emoji Search App</div>
    </div>
  )
}

function A1() {
  console.log(data);
  return (
      <ul>
      {data.map((item, index) => (
        <li key={index}>
          <img
            src={item.url}
            alt={item.name}
          />
        </li>
      ))}
    </ul>
  )
}

function A2() {
  console.log(data);
  return (
    <pre>
      {JSON.stringify(data, null, 2)};
    </pre>
  )
}

function Grid(props) {
  return (
    <div
      class="grid-container"
    >
      {data.map((item, index) => (
        <img
          src={item.emoji_url}
          alt={item.emoji_name}
          onMouseOver={() => props.onMouseOver(item.emoji_name)}
          onMouseOut={() => props.onMouseOut()}
          onMouseMove={(e) => props.onMouseMove(e)}
        />
      ))}
    </div>
  )
}

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)

    this.state = {
      emojiName: null,
      toolTipStyle: {
        position: "fixed",
        top: null,
        left: null,
        backgroundColor: "white",
        padding: "5px",
        border: "1px solid black",
        borderRadius: "3px",
        zIndex: "1",
        "font-family": "sans-serif",
      }
    }
  }

  onMouseOver(emojiName) {
    this.setState({ emojiName: emojiName});
  }

  onMouseOut() {
    this.setState({ emojiName: null });
  }

  onMouseMove(e) {
    const y = e.clientY - 11;
    const x = e.clientX + 30;

    // const x = e.clientX + 5;
    // const y = e.clientY - 30;

    this.setState({
      toolTipStyle: {
        ...this.state.toolTipStyle,
        left: x,
        top: y,
      }
    });
  }

  render() {
    // console.log('state', this.state);
    return (
      <>
        <div class="page-body">
          {/* <A1 /> */}
          {/* <A2 /> */}
          <Grid
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            onMouseMove={this.onMouseMove}
          />
        </div>
        {this.state.emojiName &&
          <div
            class="tool-tip"
            style={this.state.toolTipStyle}
          >{":"+this.state.emojiName+":"}
          </div>
        }
      </>
    )
  }
}


ReactDOM.render(
  <React.StrictMode>
    {/* <Head /> */}
    {/* <Bootstrap /> */}
    <TitleBar />
    <Body />
  </React.StrictMode>,
  document.getElementById('root')
);
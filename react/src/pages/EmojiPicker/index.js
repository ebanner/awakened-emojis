import React, { Component } from 'react';

import TitleBar from '../../components/index.js';

import { Link, useParams } from 'react-router-dom';

class Grid extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        data: null,
        // Save the mouse props functions
        onMouseOver: props.onMouseOver,
        onMouseOut: props.onMouseOut,
        onMouseMove: props.onMouseMove,
      };
    }
  
    componentDidMount() {
      var data = require('./just-custom-emojis-and-popularity.json');
      data = data.slice(0, 66-1);
  
      // Set data to the state
      this.setState({ data: data });
    }
  
    render() {
      if (! this.state.data) {
        return null;
      }
  
      return (
        <div
          class="grid-container"
        >
          {this.state.data.map((item, index) => (
            <Link to={`/emoji/${item.emoji_name}`}>
              <img
                src={item.emoji_url}
                alt={item.emoji_name}
                onMouseOver={() => this.state.onMouseOver(item.emoji_name)}
                onMouseOut={() => this.state.onMouseOut()}
                onMouseMove={(e) => this.state.onMouseMove(e)}
              />
            </Link>
          ))}
        </div>
      )
    }
  }
  
  class EmojiPickerPage extends React.Component {
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
          <TitleBar />
          <div class="page-body">
            {/* <A1 /> */}
            {/* <A2 /> */}
            <Grid
              onMouseOver={this.onMouseOver}
              onMouseOut={this.onMouseOut}
              onMouseMove={this.onMouseMove}
            />
            <div class="button-container">
              <button class="button">More</button>
            </div>
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


export default EmojiPickerPage;
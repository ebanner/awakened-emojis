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
      const data = require('./just-custom-emojis-and-popularity.json');
  
      // Set data to the state
      this.setState({ data: data });
    }
  
    render() {
      if (! this.state.data) {
        return null;
      }

      // Take the first slice of the data based on percentageOfEmojisToShow
      const numEmojisToShow = Math.floor(this.state.data.length * this.props.percentageOfEmojisToShow);
      var dataToShow = this.state.data.slice(0, numEmojisToShow);
  
      return (
        <div
          class="grid-container"
        >
          {dataToShow.map((item, index) => (
            <Link to={`/emojis/${item.emoji_name}`}>
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
      this.handleButtonClick = this.handleButtonClick.bind(this)
  
      this.state = {
        emojiName: null,
        percentageOfEmojisToShow: 0.1,
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

    handleButtonClick() {
      const newPercentageOfEmojisToShow = this.state.percentageOfEmojisToShow + 0.1;

      this.setState({
        percentageOfEmojisToShow: newPercentageOfEmojisToShow
      });
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
          <div class="page-body p-8">
            {/* <A1 /> */}
            {/* <A2 /> */}
            <Grid
              onMouseOver={this.onMouseOver}
              onMouseOut={this.onMouseOut}
              onMouseMove={this.onMouseMove}
              percentageOfEmojisToShow={this.state.percentageOfEmojisToShow}
            />
            <div class="mt-6 flex justify-center">
              <button 
                onClick={this.handleButtonClick}
                class="bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 active:scale-95 duration-200 ease-in-out px-5 py-2.5"
              >More</button>
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
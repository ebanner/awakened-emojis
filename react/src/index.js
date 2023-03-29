import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import EmojiPickerPage from './pages/EmojiPicker/index.js';
import EmojiPageWrapper from './pages/EmojiPage/index.js'

import './index.css';

// const DATA = null;

// Cells

// function A1() {
//   const data = DATA || {};

//   console.log(data);
//   return (
//       <ul>
//       {data.map((item, index) => (
//         <li key={index}>
//           <img
//             src={item.url}
//             alt={item.name}
//           />
//         </li>
//       ))}
//     </ul>
//   )
// }

// function A2() {
//   const data = DATA || {};

//   console.log(data);
//   return (
//     <pre>
//       {JSON.stringify(data, null, 2)};
//     </pre>
//   )
// }

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmojiPickerPage />} />
        <Route path="/emoji/:emojiName" element={<EmojiPageWrapper />} />
      </Routes>
    </Router>
  );
};


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
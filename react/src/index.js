import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import EmojiPickerPage from './pages/EmojiPicker/index.js';
import EmojiPageWrapper from './pages/EmojiPage/index.js'
import UsersPage from './pages/UsersPage/index.js'
import UserPage from './pages/UserPage/index.js'

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
        <Route path="/emojis/:emojiName" element={<EmojiPageWrapper />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:user" element={<UserPage />} />
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
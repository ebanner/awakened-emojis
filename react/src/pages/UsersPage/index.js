import React from 'react';
import { Link } from 'react-router-dom';

import TitleBar from '../../components/index.js';

import './index.css'

class UsersPage extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        data: null,
      }
  }

  componentDidMount() {
    var data = require('./kings.json');

    // Only take a slice of the first 5 items in the list for every key
    for (var key in data) {
      data[key] = data[key].slice(0, 5);
    }

    this.setState({ data: data });
  }

  render() {
    if (! this.state.data) {
        return null;
    }
    return (
      <div>
        <TitleBar />
        <div class="users-page-body">
            <h1>Users</h1>
            {Object.keys(this.state.data).map((key, index) => (
                <>
                  <h2>{key}</h2>
                  {this.state.data[key].map((item, index) => (
                    // Link to emoji page
                    <Link to={`/emoji/${item.name}`}>
                      <img
                        src={item.url}
                        width="32"
                      />
                    </Link>
                  ))}
                  {/* <span style={{paddingLeft: "10px"}}>
                    <button>More</button>
                  </span> */}
                </>
            ))}
          {/* <h1>Users</h1>
          <pre>
            {JSON.stringify(this.state.data, null, 2)}
          </pre> */}
        </div>
      </div>
    )
  }
}

export default UsersPage;
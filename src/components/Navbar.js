import React, { Component } from 'react';
import Identicon from 'identicon.js';
import YouChain from '../YouChain.png'

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-monospace">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={YouChain} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp;DVide0
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <big className="text-white">
              <small id="account">{this.props.account + ' '}</small>
            </big>
            {/* Return Account&Identicon... */}
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
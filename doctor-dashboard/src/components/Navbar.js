import React from "react";
import {helper} from '../helper'
import './navbar.css'
const Navbar = () => {
    let links = helper.links;
  return (
    <nav>
      <div className="nav-center">
        <div className="nav-header">
          <a href="">
            <p>DoctoLib</p>
          </a>
        </div>
        <div className="links-container">
          <ul className="links">
            {links.map((link) => {
              const { id, url, text } = link;
              return (
                <li key={id}>
                  <a href={url}>{text}</a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

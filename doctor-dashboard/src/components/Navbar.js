import React from "react";
import { Link } from "react-router-dom";
import {helper} from '../helper'
import './navbar.css'
const Navbar = () => {
    let links = helper.links;
    const handleLogout = (e) =>{
      console.log(e.target.id);
      if(e.target.id == 4)
        localStorage.clear();
    }
  return (
    <nav>
      <div className="nav-center">
        <div className="nav-header">
          <a href="/dashboard">
            <p>DoctoLib</p>
          </a>
        </div>
        <div className="links-container">
          <ul className="links">
            {links.map((link) => {
              const { id, url, text } = link;
              return (
                <li key={id} >
                  <Link to={`${url}`} id={id} onClick={handleLogout}>{text}</Link>
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

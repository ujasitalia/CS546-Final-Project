import React, { useEffect, useState } from "react";
import "./navbar.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { helper } from "../helper";
import { Link } from "react-router-dom";


const Navbar = (props) => {
  const [search, setSerarch] = useState("");
  const [specialty, setSpecialty] = useState("")

  const setSearchData = (e) => {
    setSerarch(e.target.value);
  };
  
  const handleInputChange = async (e) => {
    e.preventDefault();
    if(e.target.id === "selectSpeciality")
    {
      setSpecialty(e.target.value);
      props.handleSearch(search, e.target.value);
    }else{
      setSpecialty("")
      props.handleSearch(search);
    }
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
            <li>
              <a href="/profile">profile</a>
            </li>

            <li>
              <a href="/dashboard">dashboard</a>
            </li>

          {(window.location.pathname==="/dashboard" || window.location.pathname==="/dashboard/") && <li className="float-left navbarInput">
              <Form onSubmit={handleInputChange}>
                <Form.Control
                  type="text"
                  placeholder="Search Doctor"
                  name="search"
                  id="searchBar"
                  onChange={setSearchData}
                  value={search}
                />
                <Button variant="primary" type="submit" style={{marginLeft: 1}}>
                  Search
                </Button>
              </Form>
            </li>}

            {(window.location.pathname==="/dashboard" || window.location.pathname==="/dashboard/") && <li style={{ marginLeft: '10px' }}>
                <Form.Select aria-label="filter" id="selectSpeciality" value={specialty} onChange={handleInputChange}>
                  <option value=''>All specialities</option>
                  {helper.constant.speciality.map((element)=>{
                    return <option value={element}>{element}</option>
                  })}
                </Form.Select>
            </li>}

            <li>
              <Link to="/login" onClick={()=>{localStorage.clear()}}>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

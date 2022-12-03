import React, { useEffect, useState } from "react";
import "./navbar.css";
import { api } from "../api";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { helper } from "../helper";

const Navbar = () => {
  const [search, setSerarch] = useState("");
  const [searcResult, setSearchResult] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState("");
  const [specialty, setSpecialty] = useState("")
  const [filterResult, setFilterResult] = useState([])

  const setSearchData = (e) => {
    setSerarch(e.target.value);
  };

  const validateData = async (e) => {
    e.preventDefault();
    try {
      setSerarch(helper.common.validateSearchData(search));
      // console.log(search);
    } catch (e) {
      setHasError(true);
      setError(e.message);
      return;
    }

    try {
      const data = { search: search };
      const response = await api.search.post(data);
      setSearchResult(response.data);
      // console.log(searcResult);
    } catch (e) {
      setHasError(true);
      setError(e.response.data);
      return;
    }
  };

  
  const validateSelectData = async (e) => {
    try {
      // console.log(e.target.value);
      setSpecialty(e.target.value);
      e.target.value = helper.common.isValidString(e.target.value);
      // console.log(specialty);
    } catch (e) {
      setHasError(true);
      setError(e.message);
      return;
    }

    try {
      const data = { specialty: e.target.value };
      const response = await api.filter.post(data);
      setFilterResult(response.data);
    } catch (e) {
      setHasError(true);
      setError(e.response.data);
      return;
    }
  }

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
            <li>
              <a href="/">profile</a>
            </li>
            <li>
              <Form onSubmit={validateData}>
                <Form.Control
                  type="text"
                  placeholder="Search patient"
                  name="search"
                  onChange={setSearchData}
                />
                <Button variant="primary" type="submit" style={{marginLeft: 1}}>
                  Search
                </Button>
              </Form>
            </li>
            <li style={{ marginLeft: '10px' }}>
                <Form.Select aria-label="filter" value={specialty} onChange={validateSelectData}>
                  <option>filter specialties</option>
                  <option value="dentist">dentist</option>
                  <option value="mbbs">family medicine</option>
                  <option value="orthopedic">orthopedic</option>
                  <option value="dermatologist">dermatologist</option>
                </Form.Select>
            </li>
            {hasError && <li className="error" style={{marginLeft: 10}}>{error}</li>}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

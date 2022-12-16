import { api } from '../api';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const TestReports = (props) => {
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');
  const [testReports, setTestReports] = useState('');

  useEffect(() => {
      if(testReports==='') getTestReports();
  },[])

  const getTestReports = async() =>{
    try{
      const response = await api.doctor.getPatientTestReports(JSON.parse(localStorage.getItem('id')), props.patientId);
      console.log(response);
      setTestReports(response.data);
      setHasError(false);
    }catch(e){
      if(e.response.status===500)
        navigate("/error");
      else if(e.response.status===401 )
      {
        localStorage.clear();
        navigate("/login");
      }else{
        setHasError(true);
        setError(e.response.data);
      }
    }
  }
  return (
    <div>
        {hasError && <div className="error">{error}</div>}
        {testReports && testReports.length !== 0 ?testReports.map((testReport, index)=>{
            return <div>
              <br/>
                <div><span>Test Name : </span> <span>{testReport.testName}</span></div>
                <div><span>Test Date : </span> <span>{testReport.testDate}</span></div>
                <div><span>Document : </span> 
                <a download="myImage.gif" href={`${testReport.testDocument}`}>Download Test Report</a>
                </div>
            </div>
        })
      :
      <span>No Test Reports</span>}
    </div>
  )
}

export default TestReports
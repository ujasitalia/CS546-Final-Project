import { api } from '../api';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {helper} from '../helper';


import arrow from "../assets/images/arrow.svg";
import { isValidTestReports } from '../helper/common';

export const TestReports = (props) => {
    const [testReports, setTestReports] = useState(props.patientData.testReports);
    const [testReportsId,setTestReportsId] = useState('');
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const handleInputChange = (e) => {
        let field = e.target.id.split('-');
        let newTestReports = [...testReports]
        if(field[1] === 'disease')
            newTestReports[field[0]]['disease']=e.target.value;
        else if(field[1] === 'startDate')
        newTestReports[field[0]]['startDate']=e.target.value;
        else if(field[1] === 'endDate')
        newTestReports[field[0]]['endDate']=e.target.value;

        setTestReports(newTestReports);
    }
    
    const validateSignUp = async (e) =>{
        e.preventDefault();
        try
        {
            setTestReports(isValidTestReports(testReports));
        }catch(e){
            setHasError(true);
            setError(e.message);
            return;
        }
        
        try{
            const data = { 'testReports':testReports }
            const response = await api.profile.patchTestReports(props.patientData._id,data,e.target.id);
            console.log(response);
        }catch(e){
            setHasError(true);
            setError(e.response.data);
            return;
        }
    }
  return (
    <div>
        
        {
        props.patientData.testReports.map((test,index) => {
            return testReports && 
            <form onSubmit={validateSignUp} id={test.testReportId}>
                <div>
                    <div>
                        <label for={test.testReportId+'-'+index+'-testName'}>Test Name</label>
                        <input placeholder="Test Name" id={disease.testReportId+'-'+index+'-testName'} value={testReports[index]['testName']} onChange={handleInputChange} type="text" className="testName"/>
                    </div>
                    <div>
                        <label for={test.testReportId+'-'+index+'-document'}>Document</label>
                        <input placeholder="Document" id={test.testReportId+'-'+index+'-document'} value={(testReports[index]['document'])} onChange={handleInputChange} type="text" className="document"/>
                    </div>
                    <div>
                        <label for={test.testReportId+'-'+index+'-testDate'}>Test Date</label>
                        <input placeholder="Test Date" id={test.testReportId+'-'+index+'-testDate'} value={(testReports[index]['testDate'])} onChange={handleInputChange} type="date" className="testDate" max={getTodaysDate()}/>
                    </div>
                    <button type="submit" className="loginButton">
                        <div className="buttonBox">
                            <img src={arrow} className="arrow" loading="lazy" alt="logo" />
                        </div>
                    </button>
                </div>
            </form>
       })}
        {hasError && <div className="error">{error}</div>}
    </div>
  )
}

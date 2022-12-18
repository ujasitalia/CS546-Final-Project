import { api } from '../api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { isValidTestReports } from '../helper/common';

const TestReports = () => {
    const [testReports, setTestReports] = useState('');
    const [oldTestReports, setOldTestReports] = useState('');
    const [hasError, setHasError] = useState(false);
    const [hasSuccessMessage, setHasSuccessMessage] = useState(false);
    const [error, setError] = useState('');
    const [inputTestReport,setInputTestReport] = useState(false);
    const patientId = JSON.parse(localStorage.getItem('id'));
    const navigate = useNavigate();

    useEffect(() => {
        if(testReports==='') getTestReports();
    },[])

    const getTestReports = async() =>{
        try{
            const response = await api.patient.getPatientTestReports(patientId);
            setTestReports(response.data);
            setOldTestReports(response.data);
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

    const getBase64 = async(newTestReports, field, file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            newTestReports[field[1]]['testDocument'] = reader.result;
            setTestReports(newTestReports);
        };
    };

    const handleInputChange = (e) => {
        if(hasSuccessMessage)
            setHasSuccessMessage(false);
        if(hasError)
            setError(false);
        let field = e.target.id.split('-');
        let newTestReports = [...testReports]
        if(field[2] === 'testName')
            newTestReports[field[1]]['testName']=e.target.value;
        else if(field[2] === 'testDocument')
        {
            if(e.target.files[0].size > 12097152){
                alert("huge file");
            }else
            {
                getBase64(newTestReports,field,e.target.files[0]);
            }
            return;
        }
        else if(field[2] === 'testDate')
            newTestReports[field[1]]['testDate']=e.target.value;

        setTestReports(newTestReports);
    }
    // const processDate = (date) => {
    //     if(date)
    //     {
    //     var today = new Date(date);
    //     var dd = String(today.getDate()+1).padStart(2, '0');
    //     var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    //     var yyyy = today.getFullYear();

    //     today = yyyy + '-' + mm + '-' + dd;
    //     return today;
    //     }
    // }
    const getTodaysDate = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }
    const addTestReport = async () => {

        setInputTestReport(!inputTestReport);
        if(!inputTestReport){
            let testReportForm = {
            "testReportId": "new",
            'testName':'',
            'testDocument':'',
            'testDate':''
            }
            let newTestReports = [testReportForm,...testReports];
            setTestReports(newTestReports);
        }
        else{
            let newTestReports = [...testReports];
            newTestReports.splice(0,1);
            setTestReports(newTestReports);
        }
    }
    const validateSignUp = async (e) =>{
        e.preventDefault();
        let newTestReports;
        try
        {
            newTestReports = isValidTestReports(testReports);
            setTestReports(newTestReports);
        }catch(e){
            setHasError(true);
            setError(e.message);
            return;
        }
        if(inputTestReport && e.target.id==="new"){
            try{
                let data=newTestReports[0];
                
                const response = await api.profile.addTestReports(patientId,data);
                setTestReports(response.data)
                setOldTestReports(response.data)
                setInputTestReport(false);
                setHasError(false);
                setHasSuccessMessage(true);
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
        else
        {
            try{
                let data={};
                for(let m of newTestReports){
                    if(m['testReportId']===e.target.id) data = m;
                }
                const response = await api.profile.patchTestReports(patientId,data,e.target.id)
                setTestReports(response.data)
                setOldTestReports(response.data)
                setHasError(false);
                setHasSuccessMessage(true);
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
    }
    const getDocument = (index) =>
    {
        if(inputTestReport && index!==0)
        {
            if(oldTestReports[index-1]['testDocument'])
                return <a download="mydoc.jpg" href={`${oldTestReports[index-1]['testDocument']}`}>Download Document</a>
            else
                return <span>No Document</span>
        }else if(!inputTestReport)
        {
            if(oldTestReports[index]['testDocument'])
            return <a download="mydoc.jpg" href={`${oldTestReports[index]['testDocument']}`}>Download Document</a>
        else
            return <span>No Document</span>
        }
    }
  return (
    <div>
        {hasSuccessMessage && <div className='successMessage'>Successfully updated/created</div>}
        {hasError && <div className="error">{error}</div>}
        {!inputTestReport && <button onClick={addTestReport}>Add Test report</button>}
        {inputTestReport && <button onClick={addTestReport}>Cancel</button>}
        {testReports && oldTestReports && testReports.length!==0 ? testReports.map((test,index) => {
            return testReports && 
            <form onSubmit={validateSignUp} id={test.testReportId} key={index}>
                <br/>
                <div>
                    <div>
                        <label htmlFor={test.testReportId+'-'+index+'-testName'}>Test Name</label>
                        <input placeholder="Test Name" id={test.testReportId+'-'+index+'-testName'} value={testReports[index]['testName']} onChange={handleInputChange} type="text" className="testName"/>
                    </div>
                    <div>
                        <label htmlFor={test.testReportId+'-'+index+'-testDocument'}>Document : </label>
                        {getDocument(index)}
                        <input type="file" id={test.testReportId+'-'+index+'-testDocument'} onChange={handleInputChange} className="testDocument" key={Math.floor(Math.random()*100 + 300)}/>
                    </div>
                    <div>
                        <label htmlFor={test.testReportId+'-'+index+'-testDate'}>Test Date</label>
                        <input id={test.testReportId+'-'+index+'-testDate'} value={testReports[index]['testDate']} onChange={handleInputChange} type="date" className="testDate" max={getTodaysDate()}/>
                    </div>
                    <button type="submit" className="loginButton">Submit</button>
                </div>
            </form>
       })
       :<span>No TestReports</span>}
    </div>
  )
}

export default TestReports
import { api } from '../api';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { isValidTestReports } from '../helper/common';

const TestReports = (props) => {
    const [testReports, setTestReports] = useState(props.patientData.testReports);
    const [hasError, setHasError] = useState(false);
    const [hasSuccessMessage, setHasSuccessMessage] = useState(false);
    const [error, setError] = useState('');
    const [inputTestReport,setInputTestReport] = useState(false);
    const navigate = useNavigate();

    const getBase64 = async(newTestReports, field, file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            newTestReports[field[1]]['document'] = reader.result;
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
        else if(field[2] === 'document')
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
            'document':'',
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
                
                const response = await api.profile.addTestReports(props.patientData._id,data);
                //props.handleChange();
                // console.log(response);
                
                props.handleChange(response.data);
                setTestReports(response.data.testReports)
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
                    if(m['testReportId']==e.target.id) data = m;
                }
                const response = await api.profile.patchTestReports(props.patientData._id,data,e.target.id);
                //console.log(response);
                props.handleChange(response.data);
                setTestReports(response.data.testReports)
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
            if(props.patientData.testReports[index-1]['document'])
                return <a download="mydoc.jpg" href={`${props.patientData.testReports[index-1]['document']}`}>Download Document</a>
            else
                return <span>No Document</span>
        }else if(!inputTestReport)
        {
            if(props.patientData.testReports[index]['document'])
            return <a download="mydoc.jpg" href={`${props.patientData.testReports[index]['document']}`}>Download Document</a>
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
        {testReports && testReports.map((test,index) => {
            return testReports && 
            <form onSubmit={validateSignUp} id={test.testReportId}>
                <br/>
                <div>
                    <div>
                        <label htmlFor={test.testReportId+'-'+index+'-testName'}>Test Name</label>
                        <input placeholder="Test Name" id={test.testReportId+'-'+index+'-testName'} value={testReports[index]['testName']} onChange={handleInputChange} type="text" className="testName"/>
                    </div>
                    <div>
                        <label htmlFor={test.testReportId+'-'+index+'-document'}>Document : </label>
                        {getDocument(index)}
                        <input type="file" id={test.testReportId+'-'+index+'-document'} onChange={handleInputChange} className="document"/>
                    </div>
                    <div>
                        <label htmlFor={test.testReportId+'-'+index+'-testDate'}>Test Date</label>
                        <input placeholder="Test Date" id={test.testReportId+'-'+index+'-testDate'} value={testReports[index]['testDate']} onChange={handleInputChange} type="date" className="testDate" max={getTodaysDate()}/>
                    </div>
                    <button type="submit" className="loginButton">Submit</button>
                </div>
            </form>
       })}
    </div>
  )
}

export default TestReports
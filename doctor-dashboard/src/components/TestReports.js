import React from 'react'

const TestReports = (props) => {
  return (
    <div>
        {props.testReports.length !== 0 ?props.testReports.map((testReport, index)=>{
            return <div>
              <br/>
                <div><span>Test Name : </span> <span>{testReport.testName}</span></div>
                <div><span>Test Date : </span> <span>{testReport.testDate}</span></div>
                <div><span>Document : </span> 
                <span><img style={{height: "100px"}} src={testReport.testDocument} alt=""/></span>
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
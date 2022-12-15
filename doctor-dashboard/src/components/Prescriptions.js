import React, { useState , useEffect} from "react"

const Prescriptions = (props) => {
  const [prescriptions, setPrescriptions] = useState('');
  useEffect(() =>{
    const setState = ()=>{
      let pres = [];
      props.prescriptions.forEach(element => {
        if(element.doctorId === JSON.parse(localStorage.getItem('id')))
          pres.push(element);
      });
      setPrescriptions(pres);
    };
    if(prescriptions==='')
      setState();
  },[]);
  return (
    <div>
        {prescriptions.length!==0 ? prescriptions.map((prescription, index)=>{
            return <div>
                <span>Disease : </span> <span>{prescription.disease}</span>
                <span>Medicine : </span> <span>{prescription.medicine}</span>
                <span>Document : </span> <span><img style={{height: "100px"}} id="profileImage" src={prescription.document} alt=""/></span>
                <span>Doctor Suggestion : </span> <span>{prescription.doctorSuggestion}</span>
            </div>
        })
      :
      <span>No Prescriptions</span>}
    </div>
  )
}

export default Prescriptions
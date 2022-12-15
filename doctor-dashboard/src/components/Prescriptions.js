import React, { useState , useEffect} from "react"
import { api } from "../api";

const Prescriptions = (props) => {
  const [prescriptions, setPrescriptions] = useState('');
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');
  const [inputPrescription,setInputPrescription] = useState(false);

  const addPrescriptionForm = async () => {

    setInputPrescription(!inputPrescription);
    if(!inputPrescription){
        let prescriptionForm = {
        'prescriptionId': 'temp', 
        'disease':'',
        //'medicine':[],
        'documents':'',
        'doctorSuggestion':''
        }
        let newPrescriptions = [prescriptionForm,...prescriptions];
        setPrescriptions(newPrescriptions);
    }
    else{
        let newPrescriptions = [...prescriptions];
        newPrescriptions.splice(0,1);
        setPrescriptions(newPrescriptions);
    }
  }

  const handleInputChange = (e) => {
    let field = e.target.id.split('-');
    let newPrescription = [...prescriptions]
    if(field[2] == 'disease')
        newPrescription[field[1]]['disease']=e.target.value;
    else if(field[2] === 'doctorSuggestion')
        newPrescription[field[1]]['doctorSuggestion']=e.target.value;
    else if(field[2] === 'medicine')
        newPrescription[field[1]]['medicine']=e.target.value;

    setPrescriptions(newPrescription);
}

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

  const validatePrescription = async (e) =>{
    e.preventDefault();
    let newPrescription;
    try
    {
 //       newPrescription = isValidPrescription(medicalHistory);
        setPrescriptions(newPrescription);
    }catch(e){
        setHasError(true);
        setError(e.message);
        return;
    }
    if(inputPrescription){
        try{
            let data=newPrescription[0];
            
            const response = await api.profile.addPrescription(props.patientData._id,data);
            //props.handleChange();
            // console.log(response);
            
            props.handleChange(response.data);
            setPrescriptions(response.data.prescriptions)
            setHasError(false);
            setInputPrescription(false);
        }catch(e){
            setHasError(true);
            setError(e.response.data);
            return;
        }
    }
    else{

        try{
            let data={};
            for(let m of newPrescription){
                if(m['prescriptionId']==e.target.id) data = m;
            }
            const response = await api.profile.patchPrescription(props.patientData._id,data,e.target.id);
            //props.handleChange();
            // console.log(response);
            
            // props.handleChange(response.data);
            setHasError(false);
            setInputPrescription(false);
        }catch(e){
            setHasError(true);
            setError(e.response.data);
            return;
        }
    }
}

  return (
    <div>
        {hasError && <div className="error">{error}</div>}
        {!inputPrescription && <button onClick={addPrescriptionForm}>Add prescription</button>}
        {inputPrescription && <button onClick={addPrescriptionForm}>Cancel</button>}
        {prescriptions.length!==0 ? prescriptions.map((prescription, index)=>{
            return <div>
                <form onSubmit={validatePrescription} id={prescription.prescriptionId}>
                    <div>
                        <label htmlFor={prescription.prescriptionId+'-'+index+'-disease'}>Disease</label>
                        <input placeholder="Disease" id={prescription.prescriptionId+'-'+index+'-disease'} value={prescriptions[index]['disease']} onChange={handleInputChange} type="text" className="disease"/>
                    </div>
                    <div>
                        <label htmlFor={prescription.prescriptionId+'-'+index+'-doctorSuggestion'}>Doctor's Suggestions</label>
                        <input placeholder="Avoid alcohol" id={prescription.prescriptionId+'-'+index+'-doctorSuggestion'} value={prescriptions[index]['doctorSuggestion'] } onChange={handleInputChange} type="text" className="doctorSuggestion"/>
                    </div>
                    <div>
                        <label htmlFor={prescription.prescriptionId+'-'+index+'-medicine'}>Medicines</label>
                        <input placeholder="Medicine" id={prescription.prescriptionId+'-'+index+'-medicine'} value={prescriptions[index]['medicine'] } onChange={handleInputChange} type="text" className="medicine" />
                    </div>
                    <button type="submit" className="loginButton">Submit</button>
                
                </form>
            </div>
        })
      :
      <span>No Prescriptions</span>}
    </div>
  )
}

export default Prescriptions
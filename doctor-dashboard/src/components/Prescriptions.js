import React, { useState , useEffect} from "react"
import { api } from "../api";
import { isValidPrescription } from "../helper/common";
import '../assets/css/profile.css'

const Prescriptions = (props) => {
  const [prescriptions, setPrescriptions] = useState('');
  const [hasError, setHasError] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [inputPrescription,setInputPrescription] = useState(false);

  const addPrescriptionForm = async () => {

    setInputPrescription(!inputPrescription);
    if(!inputPrescription){
        let prescriptionForm = {
        'prescriptionId': 'temp', 
        'disease':'',
        'medicine':'',
        'strength':'',
        'dosage':'',
        'prescriptionDocument':'',
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
      {
        newPrescription[field[1]]['medicine']=e.target.value;
      }
    else if(field[2] === 'strength')
      {
        newPrescription[field[1]]['strength']=e.target.value;
      }
    else if(field[2] === 'dosage')
    {
      newPrescription[field[1]]['dosage']=e.target.value;
    }
    else if(field[2] === 'prescriptionDocument')
    {
      newPrescription[field[1]]['prescriptionDocument']=e.target.value;
    }
    setPrescriptions(newPrescription);
    setHasError(false);
    setHasSuccess(false);
}

  useEffect(() =>{
    const setState = ()=>{
      let pres = [];
      props.prescriptions.forEach(element => {
        if(element.doctorId === JSON.parse(localStorage.getItem('id')))
          pres.push(element);
      });
      pres.map(p => {
        let keys = Object.keys(p['medicine']);
        let value = p['medicine'][keys[0]];
        p['medicine']=keys[0];
        p['strength']=value[0];
        p['dosage']=value[1];
      })
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
      newPrescription = [...isValidPrescription(prescriptions)];
      setPrescriptions(newPrescription);
    }catch(e){
      setHasError(true);
      setError(e.message);
      setHasSuccess(false);
      return;
    }
    if(inputPrescription && e.target.id=='temp'){
        try{
            let data={...newPrescription[0]};
            //newPrescription=data;
            let medicineObject = {};
            medicineObject[data['medicine']]=[];
            medicineObject[data['medicine']].push(data['strength']);
            medicineObject[data['medicine']].push(parseInt(data['dosage']));
            data['medicine'] = medicineObject;
            delete data['strength'];
            delete data['dosage'];
            const response = await api.doctor.addPrescription(JSON.parse(localStorage.getItem('id')),props.patientId,data);
            //props.handleChange();
            // console.log(response);
            
            //props.handleChange(response.data);
            let pres = [...response.data.prescriptions]
            pres.map(p => {
              let keys = Object.keys(p['medicine']);
              let value = p['medicine'][keys[0]];
              p['medicine']=keys[0];
              p['strength']=value[0];
              p['dosage']=value[1];
            })
            setPrescriptions(pres)
            props.handleChange(response.data);
            setHasSuccess(true);
            setSuccessMessage('Prescription added successfully')
            setHasError(false);
            setInputPrescription(false);
        }catch(e){
            setHasError(true);
            setHasSuccess(false);
            setError(e.response.data);
            return;
        }
    }
    else{

        try{
            let data={};
            for(let m of newPrescription){
                if(m['prescriptionId']==e.target.id) data = {...m};
            }
            let medicineObject = {};
            medicineObject[data['medicine']]=[];
            medicineObject[data['medicine']].push(data['strength']);
            medicineObject[data['medicine']].push(parseInt(data['dosage']));
            data['medicine'] = medicineObject;
            delete data['strength'];
            delete data['dosage'];
            const response = await api.doctor.patchPrescription(JSON.parse(localStorage.getItem('id')),props.patientId,data,e.target.id);
            //props.handleChange();
            // console.log(response);
            
            // props.handleChange(response.data);
            let pres = [...response.data.prescriptions]
            pres.map(p => {
              let keys = Object.keys(p['medicine']);
              let value = p['medicine'][keys[0]];
              p['medicine']=keys[0];
              p['strength']=value[0];
              p['dosage']=value[1];
            })
            setPrescriptions(pres)
            props.handleChange(response.data);
            setHasSuccess(true);
            setSuccessMessage('Prescription updated successfully')
            setHasError(false);
            setInputPrescription(false);
        }catch(e){
            setHasError(true);
            setHasSuccess(false);
            setError(e.response.data);
            return;
        }
    }
}

  return (
    <div>
        <br></br>
        {hasSuccess && <div className="successMessage">{successMessage}</div>}
        {hasError && <div className="error">{error}</div>}
        <br></br>
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
                        <input placeholder="Suggestion comment" id={prescription.prescriptionId+'-'+index+'-doctorSuggestion'} value={prescriptions[index]['doctorSuggestion'] } onChange={handleInputChange} type="text" className="doctorSuggestion"/>
                    </div>
                    <div>
                        <label htmlFor={prescription.prescriptionId+'-'+index+'-medicine'}>Medicine name</label>
                        <input placeholder="Medicine Name" id={prescription.prescriptionId+'-'+index+'-medicine'} value={prescriptions[index]['medicine'] } onChange={handleInputChange} type="text" className="medicine" />
                    </div>
                    <div>
                        <label htmlFor={prescription.prescriptionId+'-'+index+'-strength'}>Medicine strength</label>
                        <input placeholder="X (in milligrams)" id={prescription.prescriptionId+'-'+index+'-strength'} value={prescriptions[index]['strength'] } onChange={handleInputChange} type="number" className="medicine" />
                    </div>
                    <div>
                        <label htmlFor={prescription.prescriptionId+'-'+index+'-dosage'}>Medicine dosage</label>
                        <input placeholder="X times a day" id={prescription.prescriptionId+'-'+index+'-dosage'} value={prescriptions[index]['dosage'] } onChange={handleInputChange} type="number" className="medicine" />
                    </div>
                    <div>
                        <label htmlFor={prescription.prescriptionId+'-'+index+'-prescriptionDocument'}>Prescription Document</label>
                        <input placeholder="Document.pdf" id={prescription.prescriptionId+'-'+index+'-prescriptionDocument'} value={prescriptions[index]['prescriptionDocument'] } onChange={handleInputChange} type="text" className="medicine" />
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
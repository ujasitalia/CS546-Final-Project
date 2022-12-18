import React, { useState , useEffect} from "react"
import { api } from "../api";
import { isValidPrescription } from "../helper/common";
import '../assets/css/profile.css'
import { useNavigate } from "react-router-dom";

const Prescriptions = (props) => {
  const [prescriptions, setPrescriptions] = useState('');
  const [oldPrescriptions, setOldPrescriptions] = useState('');
  const [hasError, setHasError] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [inputPrescription,setInputPrescription] = useState(false);
  const navigate = useNavigate();

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

  const getBase64 = async(newPrescription, field, file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        newPrescription[field[1]]['prescriptionDocument'] = reader.result;
        setPrescriptions(newPrescription);
    };
};

  const handleInputChange = (e) => {
    if(hasSuccess)
      setHasSuccess(false);
    if(hasError)
      setError(false);
    let field = e.target.id.split('-');
    let newPrescription = [...prescriptions]
    if(field[2] === 'disease')
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
      if(e.target.files[0].size > 12097152){
        alert("huge file");
      }else
      {
          getBase64(newPrescription,field,e.target.files[0]);
      }
      return;
    }
    setPrescriptions(newPrescription);
    setHasError(false);
    setHasSuccess(false);
}

  useEffect(() =>{
    const getPrecriptions = async()=>{
      try{
        let response = await api.doctor.getPatientPrescriptions(JSON.parse(localStorage.getItem('id')), props.patientId);
        let pres = [];
        response.data.forEach(element => {
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
        setOldPrescriptions(pres);
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
    };
    if(prescriptions==='')
      getPrecriptions();
  },[]);

  const validatePrescription = async (e) =>{
    e.preventDefault();
    let newPrescription;
    try
    {
      newPrescription = [...isValidPrescription(prescriptions)];
      setPrescriptions(newPrescription);
      setError(false);
    }catch(e){
      setHasError(true);
      setError(e.message);
      setHasSuccess(false);
      return;
    }
    if(inputPrescription && e.target.id==='temp'){
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
            let pres = [...response.data]
            pres.map(p => {
              let keys = Object.keys(p['medicine']);
              let value = p['medicine'][keys[0]];
              p['medicine']=keys[0];
              p['strength']=value[0];
              p['dosage']=value[1];
            })
            setPrescriptions(pres)
            setOldPrescriptions(pres)
            setHasSuccess(true);
            setSuccessMessage('Prescription added successfully')
            setHasError(false);
            setInputPrescription(false);
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
    else{

        try{
            let data={};
            for(let m of newPrescription){
                if(m['prescriptionId']===e.target.id) data = {...m};
            }
            let medicineObject = {};
            medicineObject[data['medicine']]=[];
            medicineObject[data['medicine']].push(data['strength']);
            medicineObject[data['medicine']].push(parseInt(data['dosage']));
            data['medicine'] = medicineObject;
            delete data['strength'];
            delete data['dosage'];
            const response = await api.doctor.patchPrescription(JSON.parse(localStorage.getItem('id')),props.patientId,data,e.target.id);
            let pres = [...response.data]
            pres.map(p => {
              let keys = Object.keys(p['medicine']);
              let value = p['medicine'][keys[0]];
              p['medicine']=keys[0];
              p['strength']=value[0];
              p['dosage']=value[1];
            })
            setPrescriptions(pres);
            setOldPrescriptions(pres);
            setHasSuccess(true);
            setSuccessMessage('Prescription updated successfully')
            setHasError(false);
            setInputPrescription(false);
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
    if(inputPrescription && index!==0)
    {
        if(oldPrescriptions[index-1]['prescriptionDocument'])
            return <a download="mydoc.jpg" href={`${oldPrescriptions[index-1]['prescriptionDocument']}`}>Download Document</a>
        else
            return <span>No Document</span>
    }else if(!inputPrescription)
    {
        if(oldPrescriptions[index]['prescriptionDocument'])
        return <a download="mydoc.jpg" href={`${oldPrescriptions[index]['prescriptionDocument']}`}>Download Document</a>
    else
        return <span>No Document</span>
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
        {prescriptions && oldPrescriptions && prescriptions.length!==0 ? prescriptions.map((prescription, index)=>{
            return <div key={index}>
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
                        {getDocument(index)}
                        <input type="file" id={prescription.prescriptionId+'-'+index+'-prescriptionDocument'} onChange={handleInputChange} className="medicine" key={Math.floor(Math.random()*100 + 300)}/>
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
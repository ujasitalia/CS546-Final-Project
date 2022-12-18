import React, { useState, useEffect } from 'react';
import "./styles.css";
import { components } from '../../components';
import { useNavigate} from 'react-router-dom';
import Bones from "./Bones"
import Heart from "./Heart"
import Kidney from "./Kidney"
import Liver from "./Liver"
import Lungs from "./Lungs"
import Teeth from "./Teeth"

const HealthyHabits = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('healthyHabit');
    useEffect(() => {
      if(!JSON.parse(localStorage.getItem('token_data')))
      {
        navigate("/login");
      }
    },[]);
    const handleTabChange = (e) => {
        setTab(e.target.id); 
    }
    return(
    <div className='HealthyHabits'>
            <components.Navbar/>
            <components.SecondaryNavbar/>
        {tab === 'healthyHabit' && <div>
            <div className="container">
                <div className="row healthyContainer">
                    <div className="col">
                        <h1 className="heading1">Explore the Healthy Habits</h1>
                        <p>When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need.</p>
                    </div>
                    <div className="col healthyContainer">
                        <div className="card card1" id="heart" onClick={handleTabChange}>
                            <h2>Heart</h2>
                        </div>
                        <div className="card card2" id="kidney" onClick={handleTabChange}>
                            <h2>Kidney</h2>
                        </div>
                        <div className="card card3" id="bones" onClick={handleTabChange}>
                            <h2>Bones</h2>
                        </div>
                        <div className="card card4" id="lungs" onClick={handleTabChange}>
                            <h2>Lungs</h2>
                        </div>
                        <div className="card card5" id="teeth" onClick={handleTabChange}>
                            <h2>Teeth</h2>
                        </div>
                        <div className="card card6" id="liver" onClick={handleTabChange}>
                            <h2>Liver</h2>
                        </div>
                    </div>
                </div> 
            </div>
        </div>}
        {tab === 'bones' && <Bones/>}
        {tab === 'heart' && <Heart/>}
        {tab === 'liver' && <Liver/>}
        {tab === 'lungs' && <Lungs/>}
        {tab === 'kidney' && <Kidney/>}
        {tab === 'teeth' && <Teeth/>}
    </div>
    )
}

export default HealthyHabits
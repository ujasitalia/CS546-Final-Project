import React from 'react';
import "./styles.css";

const HealthyHabits = () => {
    return(
        <div>
            <div>
            <div className="container">
        <div className="row healthyContainer">
            <div className="col">
                <h1>Explore the Healthy Habits</h1>
                <p>When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need.</p>
            </div>
            <div className="col healthyContainer">
                <div className="card card1">
                    <h5>Heart</h5>
                    <button onclick="location.href='./Heart.js'" type="button">Clck Here!</button>
                </div>
                <div className="card card2">
                    <h5>Kidney</h5>
                    <button onclick="location.href='kidney.html'" type="button">Clck Here!</button>
                </div>
                <div classNAme="card card3">
                    <h5>Bones</h5>
                    <button onclick="location.href='bones.html'" type="button">Clck Here!</button>
                </div>
                <div className="card card4">
                    <h5>Lungs</h5>
                    <button onclick="location.href='lungs.html'" type="button">Clck Here!</button>
                </div>
                <div className="card card5">
                    <h5>Teeth</h5>
                    <button onclick="location.href='teeth.html'" type="button">Clck Here!</button>
                </div>
                <div className="card card6">
                    <h5>Liver</h5>
                    <button onclick="location.href='liver.html'" type="button">Clck Here!</button>
                </div>
    
            </div>
        </div>
        
    </div>
    
            </div>
        </div>
    )
}

export default HealthyHabits
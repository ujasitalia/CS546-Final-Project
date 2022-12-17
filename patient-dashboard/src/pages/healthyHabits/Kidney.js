import React from 'react';

const Kidney = () => {
    return(
    <div>
        <div>
            <header>
                <div className="header-content">
                    <h1>Kidney</h1>
                    <div className="line"></div>
                    <h2>The kidney is the major player in the regulation of your blood pressure, and the make-up of the blood.</h2>
                </div>
            </header>

            <div className="disease">

                <div className="food-choices">
                    <h1>Healthy Food Choices</h1>
                    <ul>
                        <li>Dark leafy greens</li>
                        <li>Berries</li> 
                        <li>Fatty fish</li>
                        <li>Egg whites</li>
                    </ul> 
                </div>
    
    
                <div className="exercise">
                    <h1>Exercise</h1>
                    <ul>
                        <li>Walking</li>
                        <li>Bicycling</li>
                        <li>Swimming</li>
                        <li>Dancing</li>
                    </ul>
                </div>

            </div>
        </div>
    </div>
    )
}

export default Kidney
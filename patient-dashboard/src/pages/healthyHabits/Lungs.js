import React from 'react';

const Lungs = () => {
    return(
        <div>
            <div>
            <header>
        <div className="header-content">
            <h1 className="heading1">Lungs</h1>
            <div className="line"></div>
            <h2>Without our lungs, we can't get the oxygen we need. If your lungs are damaged, you can't breathe.</h2>
        </div>
    </header>

    <div className="disease">

        <div className="food-choices">
            <h1 className="heading1">Healthy Food Choices</h1>
            <ul>
                <li>Healthy fats from nuts, eggs, avocado etc</li>
                <li>Protein rich food</li> 
                <li>Vegetables and fruits are good sources of vitamins and minerals that prevent cardiovescular diseases.</li>
                <li>Avoid Salty foods</li>
                <li>Avoid Processed Meats</li> 
                <li>Avoid Smoking</li>
            </ul>
        </div>
    
    
        <div className="exercise">
            <h1 className="heading1">Exercise</h1>
            <ul>
                <li>Walking</li>
                <li>Weight training</li>
                <li>Swimming</li>
                <li>Yoga</li>
                <li>Cycling</li>
            </ul>
        </div>

    </div>
            </div>
        </div>
    )
}

export default Lungs
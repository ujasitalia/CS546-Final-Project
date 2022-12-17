import React from 'react';

const Heart = () => {
    return(
        <div>
            <div>
            <header>
        <div className="header-content">
            <h1 className="heading1">Heart</h1>
            <div className="line"></div>
            <h2>Heart health is central to overall good health. It’s responsible for pumping nutrient-rich blood throughout your body, it supplies oxygen while removing toxins and waste.</h2>
        </div>
    </header>

    <div className="disease">

        <div className="food-choices">
            <h1 className="heading1">Healthy Food Choices</h1>
            <ul>
                <li>Use a small plate or bowl to help control your portions.</li>
                <li>Eat more low-calorie, nutrient-rich foods, such as fruits and vegetables.</li> 
                <li>Vegetables and fruits are good sources of vitamins and minerals that prevent cardiovescular diseases.</li>
                <li>Limiting how much saturated and trans fats you eat is an important step to reduce your blood cholesterol and lower your risk of coronary artery disease.</li>
                <li>Limiting salt (sodium) is an important part of a heart-healthy diet.</li> 
                <li>Lean meat, poultry and fish, low-fat dairy products, and eggs are some of the best sources of protein. Choose lower fat options, such as skinless chicken breasts rather than fried chicken patties and skim milk rather than whole milk.</li>
                <li>Use low-fat substitutions when possible for a heart-healthy diet.</li>
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

export default Heart
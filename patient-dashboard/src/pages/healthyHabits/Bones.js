import React from 'react';

const Bones = () => {
    return(
        <div>
            <div>
                <header>
                    <div  className="header-content">
                        <h1 className="heading1">Bones</h1>
                        <div  className="line"></div>
                        <h2>Our bones support us and allow us to move. They protect our brain, heart, and other organs from injury.</h2>
                    </div>
                </header>

                <div  className="disease">
                    <div  className="food-choices">
                        <h1 className="heading1">Healthy Food Choices</h1>
                        <ul>
                            <li>Dairy Can Be an Excellent Source of Bone-Building Calcium.</li>
                            <li>Nuts Provide Magnesium and Phosphorus to Help Strengthen Bones.</li> 
                            <li>Seeds Have a Similar, Bone-Bolstering Nutrient Profile to Nuts.</li>
                            <li>Cruciferous Veggies Offer a Bevy of Nutrients That Help Fortify Bones.</li>
                            <li>Beans Are a Powerhouse Plant Food Loaded With Bone-Friendly Nutrients.</li>
                        </ul>
                    </div>

                    <div  className="exercise">
                        <h1 className="heading1">Exercise</h1>
                        <ul>
                            <li>Running</li>
                            <li>Tennis</li>
                            <li>Hopscoch</li>
                            <li>Basketball</li>
                            <li>Jumping rope</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bones
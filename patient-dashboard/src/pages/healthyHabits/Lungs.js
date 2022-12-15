import React from 'react';

const Lungs = () => {
    return(
        <div>
            <div>
            <header>
        <div className="header-content">
            <h1>Lungs</h1>
            <div className="line"></div>
            <h2>Without our lungs, we can't get the oxygen we need. If your lungs are damaged, you can't breathe.</h2>
        </div>
    </header>

    <div className="disease">

        <div className="food-choices">
            <h1>Healthy Food Choices</h1>
            <ul>Healthy fats from nuts, eggs, avocado etc</ul>
            <ul>Protein rich food</ul> 
            <ul>Vegetables and fruits are good sources of vitamins and minerals that prevent cardiovescular diseases.</ul>
            <ul>Avoid Salty foods</ul>
            <ul>Avoid Processed Meats</ul> 
            <ul>Avoid Smoking</ul>
        </div>
    
    
        <div className="exercise">
            <h1>Exercise</h1>
            <ul>Walking</ul>
            <ul>Weight training</ul>
            <ul>Swimming</ul>
            <ul>Yoga</ul>
            <ul>Cycling</ul>
        </div>

    </div>
            </div>
        </div>
    )
}

export default Lungs
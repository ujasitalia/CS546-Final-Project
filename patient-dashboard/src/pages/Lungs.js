import React from 'react';
import { components } from '../components';

const Lungs = () => {
    return(
        <div>
            <components.Navbar handleSearch={handleSearch}/>
            <div>
            <header>
        <div class="header-content">
            <h1>Lungs</h1>
            <div class="line"></div>
            <h2>Without our lungs, we can't get the oxygen we need. If your lungs are damaged, you can't breathe.</h2>
        </div>
    </header>

    <div class="disease">

        <div class="food-choices">
            <h1>Healthy Food Choices</h1>
            <ul>Healthy fats from nuts, eggs, avocado etc</ul>
            <ul>Protein rich food</ul> 
            <ul>Vegetables and fruits are good sources of vitamins and minerals that prevent cardiovescular diseases.</ul>
            <ul>Avoid Salty foods</ul>
            <ul>Avoid Processed Meats</ul> 
            <ul>Avoid Smoking</ul>
        </div>
    
    
        <div class="exercise">
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
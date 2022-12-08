import React from 'react';
import { components } from '../components';

const Liver = () => {
    return(
        <div>
            <components.Navbar handleSearch={handleSearch}/>
            <div>
            <header>
        <div class="header-content">
            <h1>Liver</h1>
            <div class="line"></div>
            <h2>The liver filters all of the blood in the body therefore a healty liver is essential.</h2>
        </div>
    </header>

    <div class="disease">

        <div class="food-choices">
            <h1>Healthy Food Choices</h1>
            <ul>Berries</ul>
            <ul>Grape fruit</ul> 
            <ul>Tea and Coffee</ul>
            <ul>Fish and Chicken</ul>
            <ul>Nuts</ul> 
            <ul>Leafy vegetables</ul>
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

export default Liver
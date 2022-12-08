import React from 'react';
import { components } from '../components';

const Kidney = () => {
    return(
        <div>
            <components.Navbar handleSearch={handleSearch}/>
            <div>
            <header>
        <div class="header-content">
            <h1>Kidney</h1>
            <div class="line"></div>
            <h2>The kidney is the major player in the regulation of your blood pressure, and the make-up of the blood.</h2>
        </div>
    </header>

    <div class="disease">

        <div class="food-choices">
            <h1>Healthy Food Choices</h1>
            <ul>Dark leafy greens</ul>
            <ul>Berries</ul> 
            <ul>Fatty fish</ul>
            <ul>Egg whites</ul> 
        </div>
    
    
        <div class="exercise">
            <h1>Exercise</h1>
            <ul>Walking</ul>
            <ul>Bicycling</ul>
            <ul>Swimming</ul>
            <ul>Dancing</ul>
        </div>

    </div>
            </div>
        </div>
    )
}

export default Kidney
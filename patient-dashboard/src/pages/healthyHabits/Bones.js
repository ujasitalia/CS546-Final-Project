import React from 'react';
import { components } from '../../components';

const Bones = () => {
    return(
        <div>
            <components.Navbar handleSearch={handleSearch}/>
            <div>
                <header>
        <div class="header-content">
            <h1>Bones</h1>
            <div class="line"></div>
            <h2>Our bones support us and allow us to move. They protect our brain, heart, and other organs from injury.</h2>
        </div>
    </header>

    <div class="disease">

        <div class="food-choices">
            <h1>Healthy Food Choices</h1>
            <ul>Dairy Can Be an Excellent Source of Bone-Building Calcium.</ul>
            <ul>Nuts Provide Magnesium and Phosphorus to Help Strengthen Bones.</ul> 
            <ul>Seeds Have a Similar, Bone-Bolstering Nutrient Profile to Nuts.</ul>
            <ul>Cruciferous Veggies Offer a Bevy of Nutrients That Help Fortify Bones.</ul>
            <ul>Beans Are a Powerhouse Plant Food Loaded With Bone-Friendly Nutrients.</ul>
        </div>
    
    
        <div class="exercise">
            <h1>Exercise</h1>
            <ul>Running</ul>
            <ul>Tennis</ul>
            <ul>Hopscoch</ul>
            <ul>Basketball</ul>
            <ul>Jumping rope</ul>
        </div>

    </div>
            </div>
        </div>
    )
}

export default Bones
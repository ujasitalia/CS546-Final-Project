import React from 'react';
import "../styles.css";
import { components } from '../components';

const Bones = () => {
    return(
        <div>
            <components.Navbar handleSearch={handleSearch}/>
            <div>
            <header>
        <div className="header-content">
            <h1>Heart</h1>
            <div className="line"></div>
            <h2>Heart health is central to overall good health. It’s responsible for pumping nutrient-rich blood throughout your body, it supplies oxygen while removing toxins and waste.</h2>
        </div>
    </header>

    <div className="disease">

        <div className="food-choices">
            <h1>Healthy Food Choices</h1>
            <ul>Use a small plate or bowl to help control your portions.</ul>
            <ul>Eat more low-calorie, nutrient-rich foods, such as fruits and vegetables.</ul> 
            <ul>Vegetables and fruits are good sources of vitamins and minerals that prevent cardiovescular diseases.</ul>
            <ul>Limiting how much saturated and trans fats you eat is an important step to reduce your blood cholesterol and lower your risk of coronary artery disease.</ul>
            <ul>Limiting salt (sodium) is an important part of a heart-healthy diet.</ul> 
            <ul>Lean meat, poultry and fish, low-fat dairy products, and eggs are some of the best sources of protein. Choose lower fat options, such as skinless chicken breasts rather than fried chicken patties and skim milk rather than whole milk.</ul>
            <ul>Use low-fat substitutions when possible for a heart-healthy diet.</ul>
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

export default Heart
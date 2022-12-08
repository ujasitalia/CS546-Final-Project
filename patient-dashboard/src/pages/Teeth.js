import React from 'react';
import { components } from '../components';

const Teeth = () => {
    return(
        <div>
            <components.Navbar handleSearch={handleSearch}/>
            <div>
            <header>
        <div class="header-content">
            <h1>Teeth</h1>
            <div class="line"></div>
            <h2>Teeth help us chew and digest food, they help us to talk and speak clearly and they also give our face its shape therefore it's very important t take care of teeth</h2>
        </div>
    </header>

    <div class="disease">

        <div class="food-choices">
            <h1>Healthy Food Choices</h1>
            <ul>Cheese is one of the best foods for healthy teeth for a number of reasons.</ul>
            <ul>Water is unlike any other drink, and is by far the healthiest drink available.</ul> 
            <ul>Crunchy, firm foods that contain lots of water are great natural teeth cleaners.</ul>
            <ul>Super healthy, leafy greens are rich in calcium, folic acid and lots of important vitamins and minerals that your teeth and gums love.</ul>
        </div>

    </div>
            </div>
        </div>
    )
}

export default Teeth
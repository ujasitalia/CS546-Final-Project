import React from "react";
import "./navbar.css";


const SecondaryNavbar = () => {
    return (
        <nav style={{paddingTop: "10px", marginBottom: "10px", paddingBottom: "8px"}}>
            <div className="nav-center">
                <div className="links-container">
                    <ul className="links">
                        <li>
                            <a href="/myAppointments">my appointments</a>
                        </li>
                        <li>
                            <a href="/healthyHabits">healthy habits</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default SecondaryNavbar;
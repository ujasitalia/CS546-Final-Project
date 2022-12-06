import React, { useState } from "react";
import { styles } from "./styles";

import message from "../assets/images/message.png";
const Chat = props => {
    const [hovered, setHovered] = useState(false)

    return (
        <div style={props.style}>
            <img src={message} className="arrow" loading="lazy" alt="logo" 
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => props.onClick && props.onClick()}
                style={{
                    ...styles.chatWithMeButton,
                    ...{ border: hovered ? '1px solid #f9f0ff' : '4px solid #7a39e0'}
                }}
            />
        </div>
    )
}

export default Chat;
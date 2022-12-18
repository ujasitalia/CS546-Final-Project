import React, { useRef, useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";
import {styles} from "./styles";
import message from "../assets/images/message.png";

const Chat = () => {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);
    const [visible, setVisible] = useState(false)
    const [hovered, setHovered] = useState(false)

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setVisible(false)
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }
  return (
    <div ref={wrapperRef}>
            {visible && <ChatWindow/>}
            <div onClick={() => setVisible(!visible)}
                style={{position: 'fixed',
                        bottom: '24px',
                        right: '24px'}}>
                <img src={message} className="arrow" loading="lazy" alt="logo" 
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() => setVisible(true)}
                    style={{
                        ...styles.chatWithMeButton,
                        ...{ border: hovered ? '1px solid #f9f0ff' : '4px solid #7a39e0'}
                    }}
                />
        </div>
    </div>
  )
}

export default Chat
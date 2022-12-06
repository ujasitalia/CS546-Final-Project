import React, { useEffect , useRef, useState} from "react";
import "../styles.css";
import { styles } from "../styles";
import ExistingChat from '../../components/existingChat/existingChat'
import ChatEngine from '../../components/chatEngine/chatengine'
import axios from "axios";
const ChatWindow = props => {
    const [conversations , setConversations] = useState([]);
    const [currentChat , setCurrentChat] = useState([null]);
    const [messages , setMessages] = useState([]);
    const [newMessage , setNewMessage] = useState("");
    const [user , setUser] = useState(null);
    const [chat , setChat] = useState(null);
    const scrollRef = useRef();
    //const {user} = useContext(authContext);
    useEffect(() =>{
        const getConversations = async () =>{
            try{
                const res = await axios.get("http://localhost:3000/chat/638ad54868dfe87d4ed59099");
                setConversations(res.data)
            }catch(e){
                console.log(e);
            }
        }
        getConversations();
    }, [])
    useEffect(() =>{
        const getMessages = async () =>{
            try{
                const res = await axios.get("http://localhost:3000/chat/638ad54868dfe87d4ed59099/"+currentChat);
                setMessages(res.data);
            }catch(e){
                console.log(e);
            }
        }
        getMessages();
    }, [currentChat])
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const message = {
            senderId : "638ad54868dfe87d4ed59099",
            receiverId : "638ad64476006be30d8349b5",
            message : newMessage
        };
        try{
            const res = await axios.post("http://localhost:3000/chat/",message);
            setMessages([...messages,res.data]);
            setNewMessage("")
        }catch(e){
            console.log(e);
        }
    }
    return (
        <div 
            className='transition-5'
            style={{
                ...styles.supportWindow,
                ...{ opacity: props.visible ? '1' : '0' }
            }}
        >
        <div className="messenger">
            <div className="chatMenu">
            <div className="chatMenuWrapper">
                {conversations.map((c) => (
                <div ref={scrollRef}>
                    <div onClick={() => setCurrentChat(c)}>
                    <ExistingChat 
                        conversation={c}
                    />
                    </div>
                </div>
                ))}
            </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {currentChat ? (<>
                    <div className="chatBoxTop">
                        {messages.map((m) => ( 
                        <div ref={scrollRef}>
                        <ChatEngine message={m} own={m.senderId.toString() === "638ad54868dfe87d4ed59099"} />
                        </div>
                        ))}
                    </div>
                    <div className="chatBoxBottom">
                        <textarea
                            className="chatMessageInput"
                            placeholder="write something..."
                            onChange={ (e) => setNewMessage(e.target.value)}
                            value={newMessage}
                        ></textarea>
                        <button className="chatSubmitButton" onClick={handleSubmit}>
                            Send
                        </button>
                    </div>
                    </>) :(
                        <span> Open a Conversation to start Chat </span>
                    )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow;
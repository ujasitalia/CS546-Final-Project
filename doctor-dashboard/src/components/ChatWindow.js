import React, { useEffect , useRef, useState} from "react";
import "../assets/css/styles.css";
import { styles } from "./styles";
import Message from './Message'
import Conversation from './Conversation'
import { api } from '../api';
import io from "socket.io-client"

const ChatWindow = () => {
    const [conversations , setConversations] = useState([]);
    const [currentChat , setCurrentChat] = useState('');
    const [messages , setMessages] = useState('');
    const [newMessage , setNewMessage] = useState("");
    const socket = io.connect("http://localhost:3000");
    const scrollRef = useRef();
    const bottomRef = useRef(null);
    const userId = JSON.parse(localStorage.getItem('id'));
    useEffect(()=>{
        const getConversations = async () =>{
            try{
                const res = await api.chat.getChatConversation(userId);
                setConversations(res.data)
            }catch(e){
                console.log(e);
            }
        }
        getConversations();
    },[])

    useEffect(() =>{
        const getMessages = async () =>{
            try{
                const res = await api.chat.getMessagesForCurrentChat(userId,currentChat);
                setMessages(res.data);
                bottomRef.current?.scrollIntoView({behavior: 'smooth'});
            }catch(e){
                console.log(e);
            }
        }
        if(currentChat!=='')
            getMessages();
    }, [currentChat])

    useEffect(() =>{
        const getMessages = async () =>{
            try{
                const res = await api.chat.getMessagesForCurrentChat(userId,currentChat);
                setMessages(res.data);
                bottomRef.current?.scrollIntoView({behavior: 'smooth'});
            }catch(e){
                console.log(e);
            }
        }
        socket.on("recievedMessage", () => {
            if(currentChat!=='')
                getMessages();
          });
    }, [socket])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const message = {
            senderId : userId,
            receiverId : currentChat,
            message : newMessage
        };
        try{
            const res = await api.chat.postMessage(message);
            socket.emit("newMessage");
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
            }}
        >
        <div className="messenger">
            <div className="chatMenu">
            <div className="chatMenuWrapper">
                {conversations.length !== 0 ? conversations.map((c) => (
                <div ref={scrollRef}>
                    <div onClick={() => setCurrentChat(c)}>
                    <Conversation 
                        conversation={c}
                    />
                    </div>
                </div>
                ))
            :<p>No Patient to chat with</p>
            }
            </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {currentChat ? (<>
                    <div className="chatBoxTop">
                        {messages && messages.map((m, index) => ( 
                        messages.length-1 === index ? <div ref={bottomRef}>
                        <Message message={m} own={m.senderId === userId} />
                        </div>
                        :
                        <div>
                        <Message message={m} own={m.senderId === userId} />
                        </div>
                        ))}
                    </div>
                    <div className="chatBoxBottom">
                        <textarea
                            className="chatMessageInput textarea"
                            placeholder="write something..."
                            onChange={ (e) => setNewMessage(e.target.value)}
                            value={newMessage}
                        ></textarea>
                        <button className="chatSubmitButton" onClick={handleSubmit}>
                            Send
                        </button>
                    </div>
                    </>) :(
                        <span className="noConversationText "> Open a Conversation to start Chat </span>
                    )}
                    </div>
                </div>
            </div>
        </div>
  )
}

export default ChatWindow
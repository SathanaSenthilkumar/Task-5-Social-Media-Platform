import React, { useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import NavIcons from "../../components/NavIcons/NavIcons";
import "./Chat.css";
import { useEffect } from "react";
import { userChats } from "../../api/ChatRequests";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

const Chat = () => {
  const dispatch = useDispatch();
  const socket = useRef();
  const { user } = useSelector((state) => state.authReducer.authData);

  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  // Get the chat in chat section
  useEffect(() => {
    let isMounted = true; // Flag to check if the component is mounted

    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        if (isMounted) {
          setChats(data); // Update state only if the component is still mounted
        }
      } catch (error) {
        if (isMounted) {
          console.log(error); // Log error only if the component is still mounted
        }
      }
    };

    getChats();

    return () => {
      isMounted = false; // Cleanup function to set the flag to false
    };
  }, [user._id]);

  // Connect to Socket.io
  useEffect(() => {
    // Initialize the socket connection
    socket.current = io("ws://localhost:8800");

    // Emit the new user event
    socket.current.emit("new-user-add", user._id);

    // Set up the event listener for getting users
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    // Cleanup function to run when the component unmounts
    return () => {
      if (socket.current) {
        // Remove the event listener
        socket.current.off("get-users");

        // Disconnect the socket to avoid memory leaks
        socket.current.disconnect();
      }
    };
  }, [user._id]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log(data);
      setReceivedMessage(data);
    });
  }, []);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };
  console.log("chats", chats);

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div
                onClick={() => {
                  setCurrentChat(chat);
                }}
              >
                <Conversation
                  data={chat}
                  currentUser={user._id}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <NavIcons />
        </div>
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default Chat;

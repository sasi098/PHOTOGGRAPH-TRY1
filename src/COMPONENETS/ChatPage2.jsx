import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import axios from "axios";
import { getusername } from "../UTILS/Local";

var stompClient = null;

export const ChatPage2 = () => {
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState("");
  const [privateChats, setPrivateChats] = useState([]);
  const username = getusername();
  const [receiver, setreciever] = useState("");
  const navigate = useNavigate();
  const connected = useRef(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const resp = await fetch(`http://localhost:8080/api/users/getinfo`);
        if (!resp.ok) {
          console.log("error in fetching user data");
        }
        const data = await resp.json();
        const rec =
          data.recieverName === username ? data.senderName : data.recieverName;
        console.log("hey this sender name " + username);
        console.log("hey this is reciever name" + rec);
        setreciever(rec);
        fetchChatHistory(username, rec);
      } catch (e) {
        console.log(e);
      }
    };
    fetchdata();
  }, []);

  if (!username?.trim()) {
    navigate("/login");
  }

  useEffect(() => {
    if (!connected.current) {
      connect();
    }
    return () => {
      if (stompClient) {
        stompClient.disconnect();
        connected.current = false;
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [privateChats]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const connect = () => {
    let sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(sock);
    stompClient.connect(
      {},
      () => {
        connected.current = true;
        stompClient.subscribe(`/user/${username}/private`, onPrivateMessage);
        fetchChatHistory(username, receiver);
        userJoin();
      },
      (err) => console.error("WebSocket connection error:", err)
    );
  };

  const userJoin = () => {
    stompClient.send(
      "/app/message",
      {},
      JSON.stringify({
        senderName: username,
        status: "JOIN",
      })
    );
  };

  const userLeft = () => {
    stompClient.send(
      "/app/message",
      {},
      JSON.stringify({
        senderName: username,
        status: "LEAVE",
      })
    );
  };

  const onPrivateMessage = (payload) => {
    const payloadData = JSON.parse(payload.body);
    setPrivateChats((prev) => [...prev, payloadData]);
  };

  const fetchChatHistory = async (user1, user2) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/api/messages/history/${user1}/${user2}`
      );
      if (response.status === 200) {
        setPrivateChats(response.data);
      } else {
        console.error("Failed to fetch chat history:", response.status);
      }
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  };

  const sendPrivate = () => {
    if (message.trim() || media) {
      const chatMessage = {
        senderName: username,
        receiverName: receiver,
        message,
        media,
        status: "MESSAGE",
      };
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setPrivateChats((prev) => [...prev, chatMessage]);
      setMessage("");
      setMedia("");
    }
  };

  const base64ConversionForImages = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => setMedia(reader.result);
      reader.onerror = (err) => console.error("File error:", err);
    }
  };

  const handleLogout = () => {
    userLeft();
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col w-1/2 mt-3">
        <div
          className="p-3 flex-grow overflow-y-auto bg-gray-300 border border-green-500 flex flex-col space-y-2 rounded-md"
          style={{ height: "500px" }}
        >
          {privateChats.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.senderName !== username ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`p-2 flex flex-col max-w-lg ${
                  msg.senderName !== username
                    ? "bg-white rounded-t-lg rounded-r-lg"
                    : "bg-blue-500 rounded-t-lg rounded-l-lg"
                }`}
              >
                <div
                  className={msg.senderName === username ? "text-white" : ""}
                >
                  {msg.message}
                </div>
                {msg.media?.includes("image") && (
                  <img src={msg.media} alt="" width="250px" />
                )}
                {msg.media?.includes("video") && (
                  <video width="320" height="240" controls>
                    <source src={msg.media} type="video/mp4" />
                  </video>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="flex items-center p-2">
          <input
            className="flex-grow p-2 border outline-blue-600 rounded-l-lg"
            type="text"
            placeholder="Message"
            value={message}
            onKeyUp={(e) => {
              if (e.key === "Enter") sendPrivate();
            }}
            onChange={(e) => setMessage(e.target.value)}
          />
          <label
            htmlFor="file"
            className="p-2 bg-blue-700 text-white rounded-r-none cursor-pointer"
          >
            📎
          </label>
          <input
            id="file"
            type="file"
            onChange={base64ConversionForImages}
            className="hidden"
          />
          <button
            className="ml-2 p-2 bg-blue-700 text-white rounded cursor-pointer"
            onClick={sendPrivate}
          >
            Send
          </button>
          <button
            className="ml-2 p-2 bg-blue-700 text-white rounded cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import axios from "axios";
import { toast } from "react-toastify";
import {
  getToken,
  getrefershtoken,
  saveToken,
  saverefershtoken,
} from "../UTILS/Local";

var stompClient = null;

const Myorders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [privateChats, setPrivateChats] = useState([]);
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState("");
  const [feedbacks, setFeedbacks] = useState({});
  const [info, setInfo] = useState("");
  const connected = useRef(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const [chat, setchat] = useState(false);
  const [id, setid] = useState();

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const resp = await fetch(`http://localhost:8083/photoapi/getorders`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (resp.status === 401) {
          const success = await refreshToken();
          if (success) return fetchOrders();
          else toast.error("Unable to refresh token.");
        }
        const data = await resp.json();
        console.log(data);
        setOrders(Array.isArray(data) ? data : data ? [data] : []);
      } catch (e) {
        console.error("Error fetching orders", e);
      }
    };
    fetchOrders();
  }, []);

  // Token refresh
  const refreshToken = async () => {
    try {
      const resp = await fetch(`http://localhost:8081/token/refresh`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ refreshtoken: getrefershtoken() }),
      });
      if (resp.status === 200) {
        const data = await resp.json();
        saveToken(data.token);
        saverefershtoken(data.refreshtoken);
        toast.success("New session token generated");
        return true;
      }
    } catch (e) {
      console.error("Error refreshing token", e);
    }
    return false;
  };

  // WebSocket connection
  useEffect(() => {
    if (selectedChat && !connected.current) {
      connectWebSocket(selectedChat.sender, selectedChat.receiver);
    }
    return () => {
      if (stompClient) {
        stompClient.disconnect();
        connected.current = false;
      }
    };
  }, [selectedChat]);

  const connectWebSocket = (sender, receiver) => {
    let sock = new SockJS("http://localhost:8083/ws");
    stompClient = over(sock);
    stompClient.connect(
      {},
      () => {
        connected.current = true;
        stompClient.subscribe(`/user/${sender}/private`, onPrivateMessage);
        fetchChatHistory(sender, receiver);
        stompClient.send(
          "/app/message",
          {},
          JSON.stringify({ senderName: sender, status: "JOIN" })
        );
      },
      (err) => console.error("WebSocket error:", err)
    );
  };

  const onPrivateMessage = (payload) => {
    const data = JSON.parse(payload.body);
    setPrivateChats((prev) => [...prev, data]);
  };

  const fetchChatHistory = async (user1, user2) => {
    try {
      const res = await axios.get(
        `http://localhost:8083/api/users/api/messages/history/${id}`
      );
      if (res.status === 200) {
        console.log(res);
        setPrivateChats(res.data);
      }
    } catch (e) {
      console.error("Error fetching chat history", e);
    }
  };

  const sendPrivate = () => {
    if (!stompClient || !connected.current) {
      toast.error("Chat is not connected yet. Please open a chat first.");
      return;
    }
    if (message.trim() || media) {
      const chatMsg = {
        senderName: selectedChat.sender,
        receiverName: selectedChat.receiver,
        message,
        media,
        status: "MESSAGE",
        id: id,
      };
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMsg));
      setPrivateChats((prev) => [...prev, chatMsg]);
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

  const handleFeedbackSubmit = async (photousernaname) => {
    try {
      const resp = await fetch(`http://localhost:8083/photoapi/postfeedback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photousernaname, text: info }),
      });
      if (resp.status === 401) {
        const success = await refreshToken();
        if (success) return handleFeedbackSubmit(photousernaname);
        else toast.error("Unable to refresh token.");
      }
      const data = await resp.text();
      toast.success(data);
      setInfo("");
      setFeedbacks((prev) => {
        const copy = { ...prev };
        delete copy[photousernaname];
        return copy;
      });
    } catch (e) {
      console.error("Error submitting feedback", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [privateChats]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📦 My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No orders found</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 border rounded-2xl shadow-lg bg-white hover:shadow-xl transition duration-300"
            >
              <div>
                <span className="font-semibold">Photo Username:</span>{" "}
                <span className="text-blue-600">{order.photousernaname}</span>
              </div>
              <div>
                <span className="font-semibold">Request Username:</span>{" "}
                <span className="text-green-600">{order.requsername}</span>
              </div>
              <div className="mt-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    order.status
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status ? "✅ Approved" : "⏳ Pending"}
                </span>
              </div>

              {order.status && (
                <>
                  <button
                    className="mt-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                      setid(order.id);
                      setchat(!chat);
                      setSelectedChat({
                        sender: order.requsername,
                        receiver: order.photousernaname,
                      });
                    }}
                  >
                    Chat
                  </button>

                  <button
                    className="ml-2 mt-3 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() =>
                      setFeedbacks((prev) => ({
                        ...prev,
                        [order.photousernaname]: true,
                      }))
                    }
                  >
                    Leave Feedback
                  </button>

                  {feedbacks[order.photousernaname] && (
                    <div className="mt-2">
                      <textarea
                        className="w-full border rounded p-2"
                        rows="3"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        placeholder="Write your feedback..."
                      />
                      <button
                        className="mt-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() =>
                          handleFeedbackSubmit(order.photousernaname)
                        }
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedChat && chat && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-3">
            Chat with {selectedChat.receiver}
          </h2>
          <div className="w-full md:w-2/3 mx-auto">
            <div
              className="p-3 overflow-y-auto bg-gray-300 border border-green-500 rounded"
              style={{ height: "400px" }}
            >
              {privateChats.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.senderName !== selectedChat.sender
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`p-2 flex flex-col max-w-lg ${
                      msg.senderName !== selectedChat.sender
                        ? "bg-white rounded-t-lg rounded-r-lg"
                        : "bg-blue-500 text-white rounded-t-lg rounded-l-lg"
                    }`}
                  >
                    <div>{msg.message}</div>
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

            <div className="flex items-center p-2 mt-2">
              <input
                className="flex-grow p-2 border outline-blue-600 rounded-l"
                type="text"
                placeholder="Message"
                value={message}
                onKeyUp={(e) => e.key === "Enter" && sendPrivate()}
                onChange={(e) => setMessage(e.target.value)}
              />
              <label
                htmlFor="file"
                className="p-2 bg-blue-700 text-white cursor-pointer"
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
                disabled={!connected.current}
                className={`ml-2 p-2 ${
                  connected.current ? "bg-blue-700" : "bg-gray-400"
                } text-white rounded`}
                onClick={sendPrivate}
              >
                Send
              </button>

              <button
                className="ml-2 p-2 bg-red-500 text-white rounded"
                onClick={() => setchat(!chat)}
              >
                CLOSE CHAT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Myorders;

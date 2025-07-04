import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineMessage } from "react-icons/md";
import axios from "axios";
import "./Chat.css";
import { setLogout } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Chat = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [socketInstance, setSocketInstance] = useState(null);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();


  const isVerified = user?.existUser?.isVerified;

  useEffect(() => {
    if (isVerified) {
      const socket = io("http://localhost:5000");
      console.log("📡 Socket connected:", socket);

      socket.on("receiveMessage", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      setSocketInstance(socket);

      return () => {
        socket.off("receiveMessage");
        socket.disconnect();
      };
    }
  }, [isVerified]);

  const sendMessage = () => {
    if (message.trim() !== "" && socketInstance) {
      const newMessage = {
        senderId: user?.existUser._id,
        senderUsername: user.existUser.username,
        content: message,
      };

      socketInstance.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleChatToggle = () => {
    if (!isVerified) {
      setShowVerificationPopup(true);
      return;
    }
    setIsOpen(!isOpen);
  };


  const sendVerificationEmail = () => {
    setLoading(true);
    axios
      .post(
        "http://localhost:3000/api/user/resend-verification",
        { email: user.existUser.email },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Verification email sent! Please check your inbox.");
        dispatch(setLogout());
        navigate("/login");
      })
      .catch((err) => {
        console.error("Error sending verification email:", err);
      })
      .finally(() => {
        setLoading(false);
        setShowVerificationPopup(false);
      });
  };
  console.log(user?.existUser?.isVerified)
  return (
    <div>
      <button className="chat-icon" onClick={handleChatToggle}>
        <MdOutlineMessage size={24} />
      </button>

      {showVerificationPopup && (
        <>
          <div className="popup-overlay show"></div>
          <div className="verification-popup show">
            <p>{t("verifyPrompt")}</p>
            <button onClick={sendVerificationEmail} disabled={loading}>
              {loading ? "Sending email..." : "Yes, send it"}
            </button>
            <button onClick={() => setShowVerificationPopup(false)}>No</button>
          </div>
        </>
      )}




      <div className={`chat-sidebar ${isOpen ? "open" : ""}`}>
        <div className="chat-header">
          <button className="chat-back-btn" onClick={() => setIsOpen(false)}>→</button>
          <h3 className="">{t("globalLiveChat")}</h3>
        </div>
        <div className="chat-body">
          {messages.map((msg, index) => {
            const isOwnMessage = msg.senderId?.toString() === user?.existUser?._id?.toString();
            return (
              <div key={index} className={`message ${isOwnMessage ? "own-message" : "other-message"}`}>
                <p>
                  <strong>
                    {isOwnMessage ? "Siz" : msg.senderUsername || "Naməlum istifadəçi"}:
                  </strong>{" "}
                  {msg.content}
                </p>
              </div>
            );
          })}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("typeMessage")}

          />
          <button onClick={sendMessage}>{t("send")}</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

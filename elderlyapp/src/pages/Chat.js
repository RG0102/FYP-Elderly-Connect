// import React, { useState, useEffect, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { auth, db } from '../firebase';
// import {
//   collection,
//   addDoc,
//   query,
//   orderBy,
//   onSnapshot,
//   serverTimestamp,
//   deleteDoc,
//   doc,
//   updateDoc,
// } from 'firebase/firestore';
// import useSpeechRecognition from "../hooks/useSpeechRecognition.js";
// import "../styles/Chat.css";  // Make sure the path to your CSS is correct

// const Chat = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { userId: otherUserId, userName: otherUserName } = location.state || {};

//   const [currentUser, setCurrentUser] = useState(null);
//   const [chatId, setChatId] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [editingText, setEditingText] = useState('');
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [hoveredMessageId, setHoveredMessageId] = useState(null);
//   const messagesEndRef = useRef(null);

//   const handleCommand = (command) => {
//     if (command.includes("back") || command.includes("go back")) {
//       navigate("/MatchedUsers");
//     }
//   };
//   useSpeechRecognition(handleCommand);

//   useEffect(() => {
//     const unsubscribeAuth = auth.onAuthStateChanged(user => setCurrentUser(user));
//     return () => unsubscribeAuth();
//   }, []);

//   useEffect(() => {
//     if (currentUser && otherUserId) {
//       setChatId([currentUser.uid, otherUserId].sort().join('_'));
//     }
//   }, [currentUser, otherUserId]);

//   useEffect(() => {
//     if (!chatId) return;
//     const messagesRef = collection(db, 'chats', chatId, 'messages');
//     const q = query(messagesRef, orderBy('timestamp'));
//     const unsubscribe = onSnapshot(q, snapshot => {
//       const msgs = [];
//       snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
//       setMessages(msgs);
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     });
//     return () => unsubscribe();
//   }, [chatId]);

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !chatId || !currentUser) return;
//     const messagesRef = collection(db, 'chats', chatId, 'messages');
//     try {
//       await addDoc(messagesRef, {
//         text: newMessage,
//         senderId: currentUser.uid,
//         timestamp: serverTimestamp(),
//       });
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   const handleDeleteMessage = async (msgId) => {
//     try {
//       await deleteDoc(doc(db, 'chats', chatId, 'messages', msgId));
//     } catch (error) {
//       console.error('Error deleting message:', error);
//     }
//   };

//   const handleEditMessage = async (msgId) => {
//     try {
//       await updateDoc(doc(db, 'chats', chatId, 'messages', msgId), { text: editingText });
//       setEditingMessageId(null);
//       setEditingText('');
//     } catch (error) {
//       console.error('Error editing message:', error);
//     }
//   };

//   const emojis = ['😀', '😂', '😍', '👍', '🙏', '😎', '🤔', '🎉', '🥳', '😇'];

//   if (!otherUserId) {
//     return (
//       <div style={{ padding: '20px', textAlign: 'center' }}>
//         <p>Error: Missing chat data. Please return to the matched users page.</p>
//         <button onClick={() => navigate('/matchedusers')}>Go Back</button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px' }}>
//       <h2>Chat with {otherUserName}</h2>
//       <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
//       {messages.map(msg => (
//   <div 
//     key={msg.id} 
//     className="message-container"
//     onMouseEnter={() => setHoveredMessageId(msg.id)}
//     onMouseLeave={() => setHoveredMessageId(null)}
//     style={{ marginBottom: '10px', textAlign: msg.senderId === currentUser?.uid ? 'right' : 'left' }}
//   >
//     <div 
//       className="message-bubble"
//       style={{
//         display: 'inline-block',
//         padding: '8px 12px',
//         borderRadius: '8px',
//         background: msg.senderId === currentUser?.uid ? '#dcf8c6' : '#fff',
//         border: '1px solid #ccc',
//         position: 'relative'
//       }}
//     >
//       <div style={{ fontSize: '0.85em', marginBottom: '4px', color: '#555' }}>
//         {msg.senderName}
//       </div>


//       {editingMessageId === msg.id ? (
//         <>
//           <input
//             type="text"
//             value={editingText}
//             onChange={e => setEditingText(e.target.value)}
//             style={{ width: '80%' }}
//           />
//           <button onClick={() => handleEditMessage(msg.id)}>Save</button>
//           <button onClick={() => { setEditingMessageId(null); setEditingText(''); }}>Cancel</button>
//         </>
//       ) : (
//         <div>{msg.text}</div>
//       )}
//       {msg.senderId === currentUser?.uid && (
//         <div
//           className="message-actions"
//           style={{
//             display: hoveredMessageId === msg.id ? 'flex' : 'none',
//             position: 'absolute',
//             top: '-5px',
//             left: '-12px',
//             gap: '5px'
//           }}
//         >
//           <button 
//             className="icon-button"
//             onClick={() => { setEditingMessageId(msg.id); setEditingText(msg.text); }}
//             style={{
//               background: 'transparent',
//               border: 'none',
//               cursor: 'pointer',
//               fontSize: '16px'
//             }}
//             title="Edit"
//           >
//             &#9998;
//           </button>
//           <button 
//             className="icon-button"
//             onClick={() => handleDeleteMessage(msg.id)}
//             style={{
//               background: 'transparent',
//               border: 'none',
//               cursor: 'pointer',
//               fontSize: '16px'
//             }}
//             title="Delete"
//           >
//             &#10006;
//           </button>
//         </div>
//       )}
//     </div>
//   </div>
// ))}



//         <div ref={messagesEndRef} />
//       </div>
//       <div style={{ display: 'flex', alignItems: 'center' }}>
//         <input
//           type="text"
//           value={newMessage}
//           onChange={e => setNewMessage(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//           placeholder="Type your message..."
//           style={{ flex: 1, padding: '10px' }}
//         />
//         <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ padding: '10px' }}>
//           😀
//         </button>
//         <button onClick={handleSendMessage} style={{ padding: '10px 20px' }}>
//           Send
//         </button>
//       </div>
//       {showEmojiPicker && (
//         <div style={{ display: 'flex', flexWrap: 'wrap', padding: '10px', border: '1px solid #ccc', marginTop: '10px' }}>
//           {emojis.map((emoji, index) => (
//             <span
//               key={index}
//               style={{ fontSize: '1.5em', cursor: 'pointer', marginRight: '5px', marginBottom: '5px' }}
//               onClick={() => {
//                 setNewMessage(newMessage + emoji);
//                 setShowEmojiPicker(false);
//               }}
//             >
//               {emoji}
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chat;




import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase"; // Ensure storage is exported from your firebase config
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useSpeechRecognition from "../hooks/useSpeechRecognition.js";
import "../styles/Chat.css";  // Ensure the path is correct

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId: otherUserId, userName: otherUserName } = location.state || {};

  const [currentUser, setCurrentUser] = useState(null);
  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleCommand = (command) => {
    if (command.includes("back") || command.includes("go back")) {
      navigate("/MatchedUsers");
    }
  };
  useSpeechRecognition(handleCommand);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Authenticated user:", user.uid);
        setCurrentUser(user);
      } else {
        console.error("No authenticated user found");
        alert("You are not authenticated!");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (currentUser && otherUserId) {
      const generatedChatId = [currentUser.uid, otherUserId].sort().join("_");
      console.log("Setting chatId:", generatedChatId);
      setChatId(generatedChatId);
    }
  }, [currentUser, otherUserId]);

  useEffect(() => {
    if (!chatId) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = [];
        snapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() });
        });
        console.log("Fetched messages:", msgs);
        setMessages(msgs);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      },
      (error) => {
        console.error("Error fetching messages:", error);
        alert("Error fetching messages: " + error.message);
      }
    );
    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !newImage) {
      console.log("No message text or image to send");
      return;
    }
    if (!chatId || !currentUser) {
      console.error("Missing chatId or currentUser");
      return;
    }
    const messagesRef = collection(db, "chats", chatId, "messages");
    try {
      let imageUrl = "";
      if (newImage) {
        console.log("Uploading image:", newImage.name);
        const imageRef = ref(
          storage,
          `chatImages/${chatId}/${Date.now()}_${newImage.name}`
        );
        const snapshot = await uploadBytes(imageRef, newImage);
        console.log("Image upload snapshot:", snapshot);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log("Retrieved image URL:", imageUrl);
      }
      await addDoc(messagesRef, {
        text: newMessage,
        imageUrl, // will be empty if no image
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        timestamp: serverTimestamp(),
      });
      console.log("Message sent successfully");
      setNewMessage("");
      setNewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message: " + error.message);
    }
  };

  const handleImageSend = async (file) => {
    if (!file || !chatId || !currentUser) {
      console.error("Missing file, chatId, or currentUser");
      return;
    }
    try {
      console.log("Uploading image via handleImageSend:", file.name);
      const imageRef = ref(
        storage,
        `chatImages/${chatId}/${Date.now()}_${file.name}`
      );
      const snapshot = await uploadBytes(imageRef, file);
      console.log("Image upload snapshot:", snapshot);
      const imageUrl = await getDownloadURL(snapshot.ref);
      console.log("Retrieved image URL:", imageUrl);
      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        text: newMessage, // you can also clear newMessage if you want to send image-only messages
        imageUrl,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
      });
      console.log("Image message sent successfully");
      setNewMessage("");
    } catch (error) {
      console.error("Error sending image:", error);
      alert("Error sending image: " + error.message);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      await deleteDoc(doc(db, "chats", chatId, "messages", msgId));
      console.log("Message deleted:", msgId);
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Error deleting message: " + error.message);
    }
  };

  const handleEditMessage = async (msgId) => {
    try {
      await updateDoc(doc(db, "chats", chatId, "messages", msgId), {
        text: editingText,
      });
      console.log("Message edited:", msgId);
      setEditingMessageId(null);
      setEditingText("");
    } catch (error) {
      console.error("Error editing message:", error);
      alert("Error editing message: " + error.message);
    }
  };

  const emojis = ["😀", "😂", "😍", "👍", "🙏", "😎", "🤔", "🎉", "🥳", "😇"];

  if (!otherUserId) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Error: Missing chat data. Please return to the matched users page.</p>
        <button onClick={() => navigate("/matchedusers")}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "20px" }}>
      <h2>Chat with {otherUserName}</h2>
      <div style={{ flex: 1, overflowY: "auto", border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="message-container"
            onMouseEnter={() => setHoveredMessageId(msg.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
            style={{ marginBottom: "10px", textAlign: msg.senderId === currentUser?.uid ? "right" : "left" }}
          >
            <div
              className="message-bubble"
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "8px",
                background: msg.senderId === currentUser?.uid ? "#dcf8c6" : "#fff",
                border: "1px solid #ccc",
                position: "relative",
              }}
            >
              <div style={{ fontSize: "0.85em", marginBottom: "4px", color: "#555" }}>
                {msg.senderName}
              </div>
              {editingMessageId === msg.id ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    style={{ width: "80%" }}
                  />
                  <button onClick={() => handleEditMessage(msg.id)}>Save</button>
                  <button onClick={() => { setEditingMessageId(null); setEditingText(""); }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {msg.text && <div>{msg.text}</div>}
                  {msg.imageUrl && (
                    <img src={msg.imageUrl} alt="sent" style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "5px" }} />
                  )}
                </>
              )}
              {msg.senderId === currentUser?.uid && (
                <div
                  className="message-actions"
                  style={{
                    display: hoveredMessageId === msg.id ? "flex" : "none",
                    position: "absolute",
                    top: "-5px",
                    left: "-12px",
                    gap: "5px",
                  }}
                >
                  <button
                    className="icon-button"
                    onClick={() => { setEditingMessageId(msg.id); setEditingText(msg.text); }}
                    style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "16px" }}
                    title="Edit"
                  >
                    &#9998;
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => handleDeleteMessage(msg.id)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "16px" }}
                    title="Delete"
                  >
                    &#10006;
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "10px" }}
        />
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ padding: "10px" }}>
          😀
        </button>
        <button onClick={handleSendMessage} style={{ padding: "10px 20px" }}>
          Send
        </button>
        <button onClick={() => fileInputRef.current.click()} style={{ padding: "10px 20px", marginLeft: "5px" }}>
          Send Image
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              console.log("File selected:", e.target.files[0].name);
              // Call handleImageSend with the selected file
              handleImageSend(e.target.files[0]);
            }
          }}
        />
      </div>
      {showEmojiPicker && (
        <div style={{ display: "flex", flexWrap: "wrap", padding: "10px", border: "1px solid #ccc", marginTop: "10px" }}>
          {emojis.map((emoji, index) => (
            <span
              key={index}
              style={{ fontSize: "1.5em", cursor: "pointer", marginRight: "5px", marginBottom: "5px" }}
              onClick={() => {
                setNewMessage(newMessage + emoji);
                setShowEmojiPicker(false);
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chat;

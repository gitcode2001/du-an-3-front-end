// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { connectChatWebSocket, disconnectChatWebSocket, sendChatMessage, sendMessage, getChatHistory } from '../services/ChatService';
// import axios from "axios";
//
// const ChatComponent = ({ senderId }) => {
//     const [messages, setMessages] = useState([]);
//     const [content, setContent] = useState('');
//     const [receiverId, setReceiverId] = useState('');
//     const [staffList, setStaffList] = useState([]);
//
//     useEffect(() => {
//         const fetchStaffList = async () => {
//             try {
//                 const response = await axios.get('/api/user/staff');
//                 setStaffList(response.data);
//             } catch (error) {
//                 toast.error('Lỗi khi tải danh sách nhân viên');
//             }
//         };
//         fetchStaffList();
//     }, []);
//
//     useEffect(() => {
//         if (receiverId) {
//             // Lấy lịch sử trò chuyện khi chọn nhân viên
//             const fetchChatHistory = async () => {
//                 try {
//                     const chatHistory = await getChatHistory(senderId, receiverId);
//                     setMessages(chatHistory);
//                 } catch (error) {
//                     toast.error('Lỗi khi tải lịch sử trò chuyện');
//                 }
//             };
//             fetchChatHistory();
//
//             // Kết nối WebSocket khi chọn nhân viên
//             connectChatWebSocket(senderId, (newMessage) => {
//                 setMessages((prevMessages) => [...prevMessages, newMessage]);
//             });
//
//             return () => {
//                 disconnectChatWebSocket();
//             };
//         }
//     }, [receiverId, senderId]);
//
//     const handleSendMessage = async () => {
//         if (!content.trim()) {
//             toast.error('Vui lòng nhập nội dung tin nhắn');
//             return;
//         }
//         if (!receiverId) {
//             toast.error('Vui lòng chọn nhân viên để nhắn tin');
//             return;
//         }
//
//         // Gửi tin nhắn qua WebSocket
//         const messageDTO = {
//             senderId,
//             receiverId,
//             content,
//             isFromAI: false
//         };
//
//         sendChatMessage(messageDTO);
//
//         // Cập nhật tin nhắn vào UI
//         setMessages((prevMessages) => [...prevMessages, messageDTO]);
//
//         // Gửi tin nhắn qua API để lưu
//         try {
//             await sendMessage(senderId, receiverId, content);
//         } catch (error) {
//             toast.error('Lỗi khi gửi tin nhắn');
//         }
//
//         // Xóa nội dung input
//         setContent('');
//     };
//
//     return (
//         <div className="chat-container">
//             <h3>Chọn nhân viên để chat:</h3>
//             <div>
//                 <select
//                     onChange={(e) => setReceiverId(e.target.value)}
//                     value={receiverId}
//                     className="staff-selector"
//                 >
//                     <option value="">Chọn nhân viên</option>
//                     {staffList.map((staff) => (
//                         <option key={staff.id} value={staff.id}>
//                             {staff.username}
//                         </option>
//                     ))}
//                 </select>
//             </div>
//
//             <div className="chat-window">
//                 <div className="messages">
//                     {messages.map((message, index) => (
//                         <div
//                             key={index}
//                             className={`message ${message.senderId === senderId ? 'sent' : 'received'}`}
//                         >
//                             <span>{message.content}</span>
//                         </div>
//                     ))}
//                 </div>
//
//                 <div className="message-input">
//                     <input
//                         type="text"
//                         value={content}
//                         onChange={(e) => setContent(e.target.value)}
//                         placeholder="Nhập tin nhắn..."
//                         className="message-text"
//                     />
//                     <button onClick={handleSendMessage} className="send-button">
//                         Gửi
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default ChatComponent;

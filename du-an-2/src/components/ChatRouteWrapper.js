// import React from 'react';
// import { useParams } from 'react-router-dom';
// import ChatWindow from './ChatWindow';
//
// const ChatRouteWrapper = () => {
//     const { receiverId } = useParams();
//     const token = localStorage.getItem('token');
//
//     const parseJwt = (token) => {
//         try {
//             return JSON.parse(atob(token.split('.')[1]));
//         } catch (e) {
//             return null;
//         }
//     };
//
//     const payload = parseJwt(token);
//
//     if (!token || !payload || !payload.sub) {
//         return <div>Token không hợp lệ hoặc người dùng chưa đăng nhập.</div>;
//     }
//
//     const currentUser = {
//         id: localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null,
//         username: payload.sub
//     };
//
//     const targetUser = {
//         id: Number(receiverId),
//         username: `user-${receiverId}`
//     };
//
//     if (!currentUser.id) {
//         return <div>Không tìm thấy userId. Vui lòng đăng nhập lại.</div>;
//     }
//
//     return <ChatWindow currentUser={currentUser} targetUser={targetUser} />;
// };
//
// export default ChatRouteWrapper;

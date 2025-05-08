import React, { useState } from 'react';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';

const ChatPage = ({ currentUser, users }) => {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="flex flex-col items-center p-6">
            <ChatList users={users} onSelectUser={setSelectedUser} />
            {selectedUser && (
                <ChatWindow
                    username={currentUser.account.username}
                    senderId={currentUser.id}
                    receiverId={selectedUser.id}
                />
            )}
        </div>
    );
};

export default ChatPage;
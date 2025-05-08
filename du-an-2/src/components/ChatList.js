import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatList = ({ onSelectUser, currentUserId }) => {
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        const fetchStaffUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                // Giả sử response.data là mảng user có account.role
                const staff = response.data.filter(user =>
                    user.account && user.account.role === 'STAFF' && user.id !== currentUserId
                );
                setStaffList(staff);
            } catch (error) {
                console.error('❌ Lỗi khi tải danh sách nhân viên:', error);
            }
        };

        fetchStaffUsers();
    }, [currentUserId]);

    return (
        <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px' }}>
            <h3>Nhân viên online</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {staffList.map(user => (
                    <li
                        key={user.id}
                        onClick={() => onSelectUser(user)}
                        style={{
                            padding: '8px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee'
                        }}
                    >
                        {user.username} ({user.account.role})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;

import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const ChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Chào bạn! Cần hỗ trợ gì không?' }
    ]);
    const [input, setInput] = useState('');

    const toggleChat = () => {
        setOpen(!open);
    };

    const handleSend = () => {
        if (input.trim() === '') return;

        const newMessages = [...messages, { from: 'user', text: input }];
        setMessages(newMessages);
        setInput('');


        setTimeout(() => {
            setMessages(prev => [...prev, { from: 'bot', text: 'cút'}]);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
            {!open ? (
                <IconButton onClick={toggleChat} sx={{ bgcolor: '#2196f3', color: '#fff' }}>
                    <ChatIcon />
                </IconButton>
            ) : (
                <Box sx={{
                    width: 300,
                    height: 400,
                    bgcolor: '#fff',
                    borderRadius: 2,
                    boxShadow: 3,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6">Hỗ trợ</Typography>
                        <IconButton onClick={toggleChat}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        bgcolor: '#f5f5f5',
                        p: 1,
                        borderRadius: 1
                    }}>
                        {messages.map((msg, i) => (
                            <Box
                                key={i}
                                sx={{
                                    textAlign: msg.from === 'user' ? 'right' : 'left',
                                    mb: 1
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        display: 'inline-block',
                                        p: 1,
                                        borderRadius: 1,
                                        bgcolor: msg.from === 'user' ? '#cce5ff' : '#e2e2e2'
                                    }}
                                >
                                    {msg.text}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    <Box mt={1} display="flex">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn..."
                            style={{
                                flex: 1,
                                padding: 8,
                                border: '1px solid #ccc',
                                borderRadius: 4,
                                marginRight: 8
                            }}
                        />
                        <button onClick={handleSend}>Gửi</button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ChatWidget;

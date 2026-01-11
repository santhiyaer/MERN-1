import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../services/socket';
import api from '../services/api';

export default function ChatRoom(){
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  useEffect(()=> {
    const fetch = async () => {
      try {
        const res = await api.get(`/messages/${roomId}`);
        setMessages(res.data);
      } catch (err) { console.error(err) }
    };
    fetch();

    socket.connect();
    socket.emit('join-room', { roomId });
    socket.on('receive-message', m => setMessages(prev => [...prev, m]));
    return () => {
      socket.off('receive-message');
      socket.disconnect();
    }
  }, [roomId]);

  const send = () => {
    if (!text) return;
    socket.emit('chat-message', { roomId, text, senderId: userId, senderRole: role });
    setText('');
  };

  return (
    <div className="bg-white p-6 rounded shadow min-h-[60vh] flex flex-col">
      <div className="flex-1 overflow-auto space-y-4 mb-4">
        {messages.map(m => (
          <div key={m._id} className={`max-w-[70%] p-3 rounded ${m.senderId === userId ? 'ml-auto bg-gradient-to-r from-indigo-600 to-teal-400 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <div>{m.text}</div>
            <div className="text-xs text-gray-400 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border px-3 py-2 rounded" placeholder="Type a message..." />
        <button onClick={send} className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
      </div>
    </div>
  );
}

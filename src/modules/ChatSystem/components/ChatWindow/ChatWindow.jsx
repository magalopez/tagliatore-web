import React, { useState, useRef, useEffect } from 'react';
import './ChatWindow.scss';

const ChatWindow = ({ chat, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await onSendMessage(message);
      setMessage(''); // Solo limpiamos el mensaje si el envío fue exitoso
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  if (!chat) {
    return (
      <div className="chat-window chat-window--empty">
        <p>Selecciona una conversación para comenzar</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-window__header">
        <div className="chat-window__header-info">
          <h3>{chat.clientName}</h3>
          <span>{chat.email}</span>
        </div>
      </div>

      <div className="chat-window__messages">
        {chat.messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-window__message ${
              msg.sender === 'admin' ? 'chat-window__message--admin' : 'chat-window__message--client'
            }`}
          >
            <div className="chat-window__message-content">
              {msg.content}
            </div>
            <div className="chat-window__message-time">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-window__input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default ChatWindow;
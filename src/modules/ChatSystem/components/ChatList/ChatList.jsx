import React from 'react';
import './ChatList.scss';

const ChatList = ({ chats, activeChat, onSelectChat, unreadMessages }) => {
  return (
    <div className="chat-list">
      <div className="chat-list__header">
        <h3>Conversaciones</h3>
      </div>
      <div className="chat-list__content">
        {chats.map(chat => (
          <div
            key={chat._id}
            className={`chat-list__item ${activeChat?._id === chat._id ? 'chat-list__item--active' : ''}`}
            onClick={() => onSelectChat(chat)}
          >
            <div className="chat-list__item-avatar">
              {chat.clientId?.name.charAt(0).toUpperCase() || 'R'}
            </div>
            <div className="chat-list__item-info">
              <span className="chat-list__item-name">{chat.clientId?.name || 'Restaurante'}</span>
              <span className="chat-list__item-preview">{chat.lastMessage}</span>
            </div>
            {chat.unreadCount > 0 && (
              <div className="chat-list__item-badge">
                {chat.unreadCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;

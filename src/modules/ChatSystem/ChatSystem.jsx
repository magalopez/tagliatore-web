import { useState, useEffect } from "react";
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/chatService';
import './ChatSystem.scss';
import ChatList from "./components/ChatList/ChatList";
import ChatWindow from "./components/ChatWindow/ChatWindow";

const ChatSystem = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [availableWaiters, setAvailableWaiters] = useState([]);
  const [selectedWaiter, setSelectedWaiter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inicializar socket
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io('http://localhost:5001', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Conectado al chat');
    });

    newSocket.on('connect_error', (err) => {
      setError('Error de conexión: ' + err.message);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [chatsResponse] = await Promise.all([
          chatService.getAllChats()
        ]);
        
        setChats(chatsResponse);

        if (user?.role === 'client') {
          const waitersResponse = await chatService.getAvailableWaiters();
          setAvailableWaiters(waitersResponse);
        }

        setIsLoading(false);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      }
    };

    if (user) {
      loadInitialData();
    }
  }, [user]);

  // Manejar mensajes nuevos
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (data) => {
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat._id === data.chatId) {
            return {
              ...chat,
              messages: [...chat.messages, data.message]
            };
          }
          return chat;
        });
      });
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket]);

  const handleSendMessage = async (message) => {
    if (!socket || !activeChat) return;
  
    try {
      // Primero, guardar el mensaje en la base de datos
      const response = await axios.post('http://localhost:5001/api/chats/message', {
        chatId: activeChat._id,
        content: message
      }, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
  
      // Emitir el mensaje través del socket
      socket.emit('send_message', {
        chatId: activeChat._id,
        message: {
          content: message,
          sender: user.id,
          senderType: user.role,
          timestamp: new Date()
        }
      });
  
      // Actualizar el estado local
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat._id === activeChat._id) {
            return {
              ...chat,
              messages: [...chat.messages, {
                content: message,
                sender: user.id,
                senderType: user.role,
                timestamp: new Date()
              }]
            };
          }
          return chat;
        });
      });
  
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      throw err; // Re-lanzar el error para que el componente ChatWindow pueda manejarlo
    }
  };

  const handleStartChat = async () => {
    if (!selectedWaiter) {
      setError('Por favor selecciona un mesero');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const data = {
        waiterId: selectedWaiter,
        message: 'Hola, ¿me podrías ayudar?'
      };
  
      const resp = await chatService.createChat(data);
      setChats(prevChats => [...prevChats, resp]);
      setActiveChat(resp);
      setSelectedWaiter('');
  
    } catch (err) {
      console.error('Error detallado:', err.response?.data);
      setError(err.response?.data?.msg || 'Error al iniciar el chat');
    }
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    if (socket) {
      socket.emit('join_chat', chat._id);
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="chat-system">
      <header className="chat-system__header">
        <h1>Chat con {user?.role === 'client' ? 'Restaurant' : 'Clientes'}</h1>
      </header>
      
      <div className="chat-system__container">
        {user?.role === 'client' ? (
          <>
            {chats.length > 0 && (
              <ChatList
                chats={chats}
                activeChat={activeChat}
                onSelectChat={handleSelectChat}
              />
            )}
            {!activeChat && (
              <div className="chat-system__start">
                <h2>Iniciar Conversación</h2>
                <select
                  value={selectedWaiter}
                  onChange={(e) => setSelectedWaiter(e.target.value)}
                  className="chat-system__select"
                >
                  <option value="">Selecciona un mesero</option>
                  {availableWaiters.map(waiter => (
                    <option key={waiter._id} value={waiter._id}>
                      {waiter.name}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={handleStartChat}
                  className="chat-system__button"
                  disabled={!selectedWaiter}
                >
                  Iniciar Chat
                </button>
              </div>
            )}
            {activeChat && (
              <ChatWindow
                chat={activeChat}
                onSendMessage={handleSendMessage}
                currentUser={user}
              />
            )}
          </>
        ) : (
          <>
            <ChatList
              chats={chats}
              activeChat={activeChat}
              onSelectChat={handleSelectChat}
            />
            <ChatWindow
              chat={activeChat}
              onSendMessage={handleSendMessage}
              currentUser={user}
            />
          </>
        )}

        {error && <div className="chat-system__error">{error}</div>}
      </div>
    </div>
  );
};

export default ChatSystem;

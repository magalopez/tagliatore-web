// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Verificar si hay un token guardado al cargar la aplicación
//     const token = localStorage.getItem('token');
//     if (token) {
//       validateToken(token);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const validateToken = async (token) => {
//     try {
//       const response = await axios.get('http://localhost:5001/api/auth/me', {
//         headers: {
//           'x-auth-token': token
//         }
//       });
//       setUser({ ...response.data, token });
//     } catch (error) {
//       localStorage.removeItem('token');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = (userData) => {
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async (token) => {
    try {
      const response = await axios.get('http://localhost:5001/api/auth/me', {
        headers: {
          'x-auth-token': token
        }
      });
      setUser({ ...response.data, token });
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
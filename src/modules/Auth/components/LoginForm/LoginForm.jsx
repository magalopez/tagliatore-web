// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../../context/AuthContext';
// import './LoginForm.scss';

// const LoginForm = () => {
//   const [credentials, setCredentials] = useState({
//     email: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   // Datos de ejemplo (en una implementación real, esto vendría de tu API)
//   const mockUsers = {
//     'admin@restaurant.com': { 
//       role: 'admin', 
//       name: 'Administrador',
//       password: 'admin123' 
//     },
//     'waiter@restaurant.com': { 
//       role: 'waiter', 
//       name: 'Mesero',
//       password: 'waiter123' 
//     },
//     'client@restaurant.com': { 
//       role: 'client', 
//       name: 'Cliente',
//       password: 'client123' 
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const user = mockUsers[credentials.email];

//     if (user && user.password === credentials.password) {
//       login({
//         email: credentials.email,
//         name: user.name,
//         role: user.role
//       });
//       navigate('/');
//     } else {
//       setError('Credenciales inválidas');
//     }
//   };

//   return (
//     <div className="login">
//       <form className="login__form" onSubmit={handleSubmit}>
//         <h2 className="login__title">Iniciar Sesión</h2>
        
//         {error && <div className="login__error">{error}</div>}
        
//         <div className="login__group">
//           <label className="login__label">Email</label>
//           <input
//             type="email"
//             className="login__input"
//             value={credentials.email}
//             onChange={(e) => setCredentials({...credentials, email: e.target.value})}
//             required
//           />
//         </div>

//         <div className="login__group">
//           <label className="login__label">Contraseña</label>
//           <input
//             type="password"
//             className="login__input"
//             value={credentials.password}
//             onChange={(e) => setCredentials({...credentials, password: e.target.value})}
//             required
//           />
//         </div>

//         <button type="submit" className="login__submit">
//           Ingresar
//         </button>

//         <div className="login__demo-credentials">
//           <p>Credenciales de prueba:</p>
//           <small>Admin: admin@restaurant.com / admin123</small>
//           <small>Mesero: waiter@restaurant.com / waiter123</small>
//           <small>Cliente: client@restaurant.com / client123</small>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;

import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import './LoginForm.scss';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', credentials);
      const { token, user } = response.data;
      
      // Guardar el token
      localStorage.setItem('token', token);
      
      // Actualizar el contexto de autenticación
      login({
        ...user,
        token
      });

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__title">Iniciar Sesión</h2>
        
        {error && <div className="login__error">{error}</div>}
        
        <div className="login__group">
          <label className="login__label">Email</label>
          <input
            type="email"
            className="login__input"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>

        <div className="login__group">
          <label className="login__label">Contraseña</label>
          <input
            type="password"
            className="login__input"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="login__submit"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
        </button>

        {/* Temporalmente mantenemos las credenciales de prueba */}
        <div className="login__demo-credentials">
          <p>Credenciales de prueba:</p>
          <small>Admin: admin@test.com / 123456</small>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

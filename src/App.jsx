import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

import DishManagement from './modules/DishManagement/DishManagement';
import ClientManagement from './modules/ClientManagement/ClientManagement';
import OrderManagement from './modules/OrderManagement/OrderManagement';
import CategoryManagement from './modules/CategoryManagement/CategoryManagement';
import WaiterManagement from './modules/WaiterManagement/WaiterManagement';
import ChatSystem from './modules/ChatSystem/ChatSystem';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './modules/Auth/components/LoginForm/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import Welcome from './components/Welcome/Welcome';

const Navigation = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const getNavLinks = () => {
    switch (user.role) {
      case 'admin':
        return (
          <>
            <li className="app__menu-item">
              <Link to="/dishes" className="app__menu-link">Gestión de Platillos</Link>
            </li>
            <li className="app__menu-item">
              <Link to="/categories" className="app__menu-link">Gestión de Categorías</Link>
            </li>
            <li className="app__menu-item">
              <Link to="/orders" className="app__menu-link">Gestión de Órdenes</Link>
            </li>
            <li className="app__menu-item">
              <Link to="/clients" className="app__menu-link">Gestión de Clientes</Link>
            </li>
            <li className="app__menu-item">
              <Link to="/waiters" className="app__menu-link">Gestión de Meseros</Link>
            </li>
            <li className="app__menu-item">
              <Link to="/chat" className="app__menu-link">Chat</Link>
            </li>
          </>
        );
      case 'waiter':
        return (
          <>
            <li className="app__menu-item">
              <Link to="/orders" className="app__menu-link">Gestión de Órdenes</Link>
            </li>
            <li className="app__menu-item">
              <Link to="/chat" className="app__menu-link">Chat</Link>
            </li>
          </>
        );
      case 'client':
        return (
          <li className="app__menu-item">
            <Link to="/chat" className="app__menu-link">Chat</Link>
          </li>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="app__navigation">
      <div className="app__logo">
        <h2>Tagliatore</h2>
      </div>
      <ul className="app__menu">
        {getNavLinks()}
        <li className="app__menu-item">
          <button onClick={logout} className="app__menu-link app__menu-link--logout">
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Navigation />
      <main className="app__main">
        <Routes>
          <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/" />} />
          
          <Route path="/" element={
            <ProtectedRoute
              element={<Welcome />}
              allowedRoles={['admin', 'waiter', 'client']}
            />
          } />
          
          <Route path="/dishes" element={
            <ProtectedRoute
              element={<DishManagement />}
              allowedRoles={['admin']}
            />
          } />
          
          <Route path="/categories" element={
            <ProtectedRoute
              element={<CategoryManagement />}
              allowedRoles={['admin']}
            />
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute
              element={<OrderManagement />}
              allowedRoles={['admin', 'waiter']}
            />
          } />
          
          <Route path="/clients" element={
            <ProtectedRoute
              element={<ClientManagement />}
              allowedRoles={['admin']}
            />
          } />
          
          <Route path="/waiters" element={
            <ProtectedRoute
              element={<WaiterManagement />}
              allowedRoles={['admin']}
            />
          } />
          
          <Route path="/chat" element={
            <ProtectedRoute
              element={<ChatSystem />}
              allowedRoles={['admin', 'waiter', 'client']}
            />
          } />
        </Routes>
      </main>
    </div>
  );
}

// Envolver la aplicación con AuthProvider
const AppWrapper = () => {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
};

export default AppWrapper;

// function App() {
//   return (
//     <Router>
//       <div className="app">
//         <nav className="app__navigation">
//           <div className="app__logo">
//             <h2>Tagliatore</h2>
//           </div>
//           <ul className="app__menu">
//             <li className="app__menu-item">
//               <Link to="/" className="app__menu-link">Inicio</Link>
//             </li>
//             <li className="app__menu-item">
//               <Link to="/dishes" className="app__menu-link">Gestión de Platillos</Link>
//             </li>
//             <li className="app__menu-item">
//               <Link to="/categories" className="app__menu-link">Gestión de Categorías</Link>
//             </li>
//             <li className="app__menu-item">
//               <Link to="/orders" className="app__menu-link">Gestión de Órdenes</Link>
//             </li>
//             <li className="app__menu-item">
//               <Link to="/clients" className="app__menu-link">Gestión de Clientes</Link>
//             </li>
//             <li className="app__menu-item">
//               <Link to="/waiters" className="app__menu-link">Gestión de Meseros</Link>
//             </li>
//             <li className="app__menu-item">
//               <Link to="/chat" className="app__menu-link">Chat con Clientes</Link>
//             </li>
//           </ul>
//         </nav>

//         <main className="app__main">
//           <Routes>
//             <Route path="/" element={
//               <div className="app__welcome">
//                 <h1>Bienvenido al Sistema de Gestión</h1>
//                 <p>Selecciona una opción del menú para comenzar</p>
//               </div>
//             } />
//             <Route path="/dishes" element={<DishManagement />} />
//             <Route path="/categories" element={<CategoryManagement />} />
//             <Route path="/orders" element={<OrderManagement />} />
//             <Route path="/clients" element={<ClientManagement />} />
//             <Route path="/waiters" element={<WaiterManagement />} />
//             <Route path="/chat" element={<ChatSystem />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;
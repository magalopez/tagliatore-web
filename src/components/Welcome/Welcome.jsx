import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Welcome.scss';

const Welcome = () => {
  const { user } = useAuth();

  const getRoleContent = () => {
    switch (user.role) {
      case 'admin':
        return {
          title: 'Panel de Administración',
          description: 'Bienvenido al panel de administración. Aquí puedes gestionar todos los aspectos del restaurante.',
          features: [
            'Gestión de Platillos y Categorías',
            'Gestión de Órdenes',
            'Gestión de Clientes',
            'Gestión de Meseros',
            'Sistema de Chat'
          ]
        };
      case 'waiter':
        return {
          title: 'Panel de Mesero',
          description: 'Bienvenido al panel de meseros. Aquí puedes gestionar órdenes y comunicarte con los clientes.',
          features: [
            'Gestión de Órdenes',
            'Chat con Clientes'
          ]
        };
      case 'client':
        return {
          title: 'Bienvenido a Tagliatore',
          description: 'Gracias por elegirnos. Estamos aquí para atenderte.',
          features: [
            'Chat con el Restaurante',
            'Soporte en tiempo real'
          ]
        };
      default:
        return {
          title: 'Bienvenido',
          description: 'Por favor, contacta al administrador para obtener acceso.',
          features: []
        };
    }
  };

  const content = getRoleContent();

  return (
    <div className="welcome">
      <div className="welcome__content">
        <h1 className="welcome__title">{content.title}</h1>
        <p className="welcome__description">{content.description}</p>
        
        {content.features.length > 0 && (
          <div className="welcome__features">
            <h2 className="welcome__subtitle">Funcionalidades disponibles:</h2>
            <ul className="welcome__list">
              {content.features.map((feature, index) => (
                <li key={index} className="welcome__list-item">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="welcome__user-info">
          <p>Sesión iniciada como: <strong>{user.name}</strong></p>
          <p>Rol: <strong>{user.role}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
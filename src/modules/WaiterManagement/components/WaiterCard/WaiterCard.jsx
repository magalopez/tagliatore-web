import './WaiterCard.scss';

const WaiterCard = ({ waiter, onEdit, onToggleActive }) => {
  const scheduleLabels = {
    morning: 'Mañana (6:00 - 14:00)',
    evening: 'Tarde (14:00 - 22:00)',
    night: 'Noche (22:00 - 6:00)'
  };

  return (
    <div className={`waiter-card ${!waiter.isActive ? 'waiter-card--inactive' : ''}`}>
      <div className="waiter-card__header">
        <h3 className="waiter-card__name">{waiter.name}</h3>
        <span className={`waiter-card__status ${waiter.isActive ? 'waiter-card__status--active' : 'waiter-card__status--inactive'}`}>
          {waiter.isActive ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="waiter-card__info">
        <div className="waiter-card__detail">
          <span className="waiter-card__label">DNI:</span>
          <span>{waiter.dni}</span>
        </div>
        <div className="waiter-card__detail">
          <span className="waiter-card__label">Teléfono:</span>
          <span>{waiter.phone}</span>
        </div>
        <div className="waiter-card__detail">
          <span className="waiter-card__label">Email:</span>
          <span>{waiter.email}</span>
        </div>
        <div className="waiter-card__detail">
          <span className="waiter-card__label">Horario:</span>
          <span>{scheduleLabels[waiter.schedule]}</span>
        </div>
        <div className="waiter-card__detail">
          <span className="waiter-card__label">Inicio:</span>
          <span>{new Date(waiter.startDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="waiter-card__actions">
        <button 
          className="waiter-card__button waiter-card__button--edit"
          onClick={() => onEdit(waiter)}
        >
          Editar
        </button>
        <button 
        className={`waiter-card__button ${waiter.isActive ? 'waiter-card__button--deactivate' : 'waiter-card__button--activate'}`}
        onClick={() => onToggleActive(waiter._id)}  // Cambiar id por _id
        >
          {waiter.isActive ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    </div>
  );
};

export default WaiterCard;

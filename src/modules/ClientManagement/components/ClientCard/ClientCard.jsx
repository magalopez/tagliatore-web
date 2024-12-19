import './ClientCard.scss';

const ClientCard = ({ client, onEdit, onDelete }) => {
  return (
    <div className="client-card">
      <div className="client-card__header">
        <h3 className="client-card__name">{client.name}</h3>
        <div className="client-card__actions">
          <button 
            className="client-card__button client-card__button--edit"
            onClick={() => onEdit(client)}
          >
            Editar
          </button>
          <button 
            className="client-card__button client-card__button--delete"
            onClick={() => onDelete(client._id)}
          >
            Eliminar
          </button>
        </div>
      </div>
      <div className="client-card__info">
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Teléfono:</strong> {client.phone}</p>
        <p><strong>DNI:</strong> {client.dni}</p>
      </div>
    </div>
  );
};

export default ClientCard;

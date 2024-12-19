import './OrderCard.scss';

const OrderCard = ({ order, onEdit, onDelete, onUpdateStatus }) => {
  const statusLabels = {
    pending: 'Pendiente',
    preparing: 'En Preparación',
    ready: 'Listo',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  };

  return (
    <div className="order-card">
      <div className="order-card__header">
        <h3 className="order-card__title">Mesa {order.tableNumber}</h3>
        <span className={`order-card__status order-card__status--${order.status}`}>
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="order-card__client">
        <strong>Cliente:</strong> {order.clientId.name}
      </div>
      <div className="order-card__waiter">
        <strong>Mesero:</strong> {order.waiterId.name}
      </div>

      <div className="order-card__items">
        {order.items.map((item) => (
          <div key={item._id} className="order-card__item">
            <span>{item.dishId.name}</span>
            <span>x{item.quantity}</span>
            <span>${item.subtotal.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="order-card__total">
        Total: ${order.total.toFixed(2)}
      </div>

      {order.notes && (
        <div className="order-card__notes">
          <strong>Notas:</strong> {order.notes}
        </div>
      )}

      <div className="order-card__actions">
        <select
          className="order-card__status-select"
          value={order.status}
          onChange={(e) => onUpdateStatus(order._id, e.target.value)}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button
          className="order-card__button order-card__button--edit"
          onClick={() => onEdit(order)}
        >
          Editar
        </button>
        <button
          className="order-card__button order-card__button--delete"
          onClick={() => onDelete(order._id)}
        >
          Eliminar
        </button>
      </div>

      <div className="order-card__date">
        {new Date(order.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default OrderCard;

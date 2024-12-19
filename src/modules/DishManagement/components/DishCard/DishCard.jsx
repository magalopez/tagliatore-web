import './DishCard.scss';

const DishCard = ({ dish, onEdit, onDelete }) => {
  return (
    <div className="dish-card">
      <img src={dish.image} alt={dish.name} className="dish-card__image" />
      <div className="dish-card__content">
        <h3 className="dish-card__title">{dish.name}</h3>
        <p className="dish-card__ingredients">{dish.ingredients}</p>
        <p className="dish-card__price">${dish.price}</p>
        <div className="dish-card__actions">
          <button 
            className="dish-card__button dish-card__button--edit"
            onClick={() => onEdit(dish)}
          >
            Editar
          </button>
          <button 
            className="dish-card__button dish-card__button--delete"
            onClick={() => onDelete(dish._id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;

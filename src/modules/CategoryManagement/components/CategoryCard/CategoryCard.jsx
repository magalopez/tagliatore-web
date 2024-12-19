import './CategoryCard.scss';

const CategoryCard = ({ category, onEdit, onDelete }) => {
  return (
    <div className={`category-card ${!category.isActive ? 'category-card--inactive' : ''}`}>
      <div className="category-card__content">
        <h3 className="category-card__title">{category.name}</h3>
        <p className="category-card__description">{category.description}</p>
        <div className="category-card__status">
          <span className={`category-card__badge ${category.isActive ? 'category-card__badge--active' : 'category-card__badge--inactive'}`}>
            {category.isActive ? 'Activa' : 'Inactiva'}
          </span>
        </div>
      </div>
      
      <div className="category-card__actions">
        <button 
          className="category-card__button category-card__button--edit"
          onClick={() => onEdit(category)}
        >
          Editar
        </button>
        <button 
          className="category-card__button category-card__button--delete"
          onClick={() => onDelete(category._id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;

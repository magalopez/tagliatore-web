import DishCard from '../DishCard/DishCard';

import './DishList.scss';

const DishList = ({ dishes, onEdit, onDelete }) => {
  return (
    <div className="dish-list">
      {dishes.map(dish => (
        <DishCard
          key={dish.id}
          dish={dish}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DishList;

import React, { useState, useEffect } from 'react';
import DishForm from './components/DishForm/DishForm';
import DishList from './components/DishList/DishList';
import { dishService } from '../../services/dishService';
import './DishManagement.scss';

const DishManagement = () => {
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      const data = await dishService.getAll();
      setDishes(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error al cargar los platillos');
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedDish) {
        // Actualizar platillo existente
        const updatedDish = await dishService.update(selectedDish._id, {
          ...formData,
          price: Number(formData.price)
        });
        setDishes(dishes.map(dish => 
          dish._id === selectedDish._id ? updatedDish : dish
        ));
      } else {
        // Crear nuevo platillo
        const newDish = await dishService.create({
          ...formData,
          price: Number(formData.price)
        });
        setDishes([...dishes, newDish]);
      }
      setIsFormVisible(false);
      setSelectedDish(null);
    } catch (err) {
      setError('Error al guardar el platillo');
      console.error(err);
    }
  };

  const handleEdit = (dish) => {
    setSelectedDish(dish);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este platillo?')) {
      try {
        await dishService.delete(id);
        setDishes(dishes.filter(dish => dish._id !== id));
      } catch (err) {
        setError('Error al eliminar el platillo');
        console.error(err);
      }
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dish-management">
      <header className="dish-management__header">
        <h1 className="dish-management__title">Gestión de Platillos</h1>
        <button 
          className="dish-management__add-button"
          onClick={() => {
            setSelectedDish(null);
            setIsFormVisible(true);
          }}
        >
          Agregar Nuevo Platillo
        </button>
      </header>

      {error && <div className="dish-management__error">{error}</div>}

      {isFormVisible && (
        <DishForm 
          dish={selectedDish}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormVisible(false);
            setSelectedDish(null);
          }}
        />
      )}

      <DishList
        dishes={dishes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DishManagement;

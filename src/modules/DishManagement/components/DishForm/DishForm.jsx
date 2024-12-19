import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DishForm.scss';

const DishForm = ({ dish, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: dish?.name || '',
    ingredients: dish?.ingredients || '',
    price: dish?.price || '',
    image: dish?.image || '',
    categoryId: dish?.categoryId || ''
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/categories');
        setCategories(response.data);
      } catch (err) {
        setError('Error al cargar las categorías');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price)
    });
  };

  return (
    <form className="dish-form" onSubmit={handleSubmit}>
      <div className="dish-form__group">
        <label className="dish-form__label">Nombre del platillo</label>
        <input
          type="text"
          className="dish-form__input"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      <div className="dish-form__group">
        <label className="dish-form__label">Categoría</label>
        {isLoading ? (
          <p className="dish-form__loading">Cargando categorías...</p>
        ) : error ? (
          <p className="dish-form__error">{error}</p>
        ) : (
          <select
            className="dish-form__select"
            value={formData.categoryId}
            onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>
      
      <div className="dish-form__group">
        <label className="dish-form__label">Ingredientes</label>
        <textarea
          className="dish-form__textarea"
          value={formData.ingredients}
          onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
          required
        />
      </div>

      <div className="dish-form__group">
        <label className="dish-form__label">Precio</label>
        <input
          type="number"
          className="dish-form__input"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
          step="0.01"
          min="0"
        />
      </div>

      <div className="dish-form__group">
        <label className="dish-form__label">URL de la imagen</label>
        <input
          type="url"
          className="dish-form__input"
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
          placeholder="https://ejemplo.com/imagen.jpg"
          required
        />
        {formData.image && (
          <img 
            src={formData.image} 
            alt="Vista previa" 
            className="dish-form__image-preview"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
      </div>

      <div className="dish-form__actions">
        <button 
          type="submit" 
          className="dish-form__submit"
          disabled={isLoading}
        >
          {dish ? 'Actualizar Platillo' : 'Crear Platillo'}
        </button>
        <button 
          type="button" 
          className="dish-form__cancel"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default DishForm;

import React, { useState } from 'react';
import './CategoryForm.scss';

const CategoryForm = ({ category, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    isActive: category?.isActive ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <div className="category-form__group">
        <label className="category-form__label">Nombre de la Categoría</label>
        <input
          type="text"
          className="category-form__input"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>

      <div className="category-form__group">
        <label className="category-form__label">Descripción</label>
        <textarea
          className="category-form__textarea"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Describe la categoría..."
        />
      </div>

      <div className="category-form__group">
        <label className="category-form__checkbox-label">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          />
          Categoría Activa
        </label>
      </div>

      <div className="category-form__actions">
        <button type="submit" className="category-form__submit">
          {category ? 'Actualizar Categoría' : 'Crear Categoría'}
        </button>
        <button 
          type="button" 
          className="category-form__cancel"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;

import React, { useState } from 'react';
import './ClientForm.scss';

const ClientForm = ({ client, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    dni: client?.dni || '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone.match(/^\d{9}$/)) {
      newErrors.phone = 'El teléfono debe tener 9 dígitos';
    }
    if (!formData.dni.match(/^\d{8}$/)) {
      newErrors.dni = 'El DNI debe tener 8 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="client-form" onSubmit={handleSubmit}>
      <div className="client-form__group">
        <label className="client-form__label">Nombre completo</label>
        <input
          type="text"
          className={`client-form__input ${errors.name ? 'client-form__input--error' : ''}`}
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        {errors.name && <span className="client-form__error">{errors.name}</span>}
      </div>

      <div className="client-form__group">
        <label className="client-form__label">Email</label>
        <input
          type="email"
          className={`client-form__input ${errors.email ? 'client-form__input--error' : ''}`}
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        {errors.email && <span className="client-form__error">{errors.email}</span>}
      </div>

      <div className="client-form__group">
        <label className="client-form__label">Teléfono</label>
        <input
          type="tel"
          className={`client-form__input ${errors.phone ? 'client-form__input--error' : ''}`}
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
        {errors.phone && <span className="client-form__error">{errors.phone}</span>}
      </div>

      <div className="client-form__group">
        <label className="client-form__label">DNI</label>
        <input
          type="text"
          className={`client-form__input ${errors.dni ? 'client-form__input--error' : ''}`}
          value={formData.dni}
          onChange={(e) => setFormData({...formData, dni: e.target.value})}
        />
        {errors.dni && <span className="client-form__error">{errors.dni}</span>}
      </div>

      <div className="client-form__actions">
        <button type="submit" className="client-form__submit">
          {client ? 'Actualizar Cliente' : 'Registrar Cliente'}
        </button>
        <button 
          type="button" 
          className="client-form__cancel"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ClientForm;

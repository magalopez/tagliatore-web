import React, { useState } from 'react';
import './WaiterForm.scss';

const WaiterForm = ({ waiter, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: waiter?.name || '',
    dni: waiter?.dni || '',
    phone: waiter?.phone || '',
    email: waiter?.email || '',
    password: '',  // Añadir campo de contraseña
    address: waiter?.address || '',
    startDate: waiter?.startDate || '',
    schedule: waiter?.schedule || '',
    isActive: waiter?.isActive ?? true
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.dni.match(/^\d{8}$/)) {
      newErrors.dni = 'El DNI debe tener 8 dígitos';
    }
    if (!formData.phone.match(/^\d{9}$/)) {
      newErrors.phone = 'El teléfono debe tener 9 dígitos';
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Email inválido';
    }

    if (!waiter && !formData.password) {
      newErrors.password = 'La contraseña es requerida para nuevos meseros';
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
    <form className="waiter-form" onSubmit={handleSubmit}>
      <div className="waiter-form__grid">
        <div className="waiter-form__group">
          <label className="waiter-form__label">Nombre completo</label>
          <input
            type="text"
            className={`waiter-form__input ${errors.name ? 'waiter-form__input--error' : ''}`}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          {errors.name && <span className="waiter-form__error">{errors.name}</span>}
        </div>

        <div className="waiter-form__group">
          <label className="waiter-form__label">DNI</label>
          <input
            type="text"
            className={`waiter-form__input ${errors.dni ? 'waiter-form__input--error' : ''}`}
            value={formData.dni}
            onChange={(e) => setFormData({...formData, dni: e.target.value})}
          />
          {errors.dni && <span className="waiter-form__error">{errors.dni}</span>}
        </div>

        <div className="waiter-form__group">
          <label className="waiter-form__label">Teléfono</label>
          <input
            type="tel"
            className={`waiter-form__input ${errors.phone ? 'waiter-form__input--error' : ''}`}
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          {errors.phone && <span className="waiter-form__error">{errors.phone}</span>}
        </div>

        <div className="waiter-form__group">
          <label className="waiter-form__label">Email</label>
          <input
            type="email"
            className={`waiter-form__input ${errors.email ? 'waiter-form__input--error' : ''}`}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          {errors.email && <span className="waiter-form__error">{errors.email}</span>}
        </div>

        <div className="waiter-form__group">
          <label className="waiter-form__label">Fecha de inicio</label>
          <input
            type="date"
            className="waiter-form__input"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
          />
        </div>

        <div className="waiter-form__group">
          <label className="waiter-form__label">Horario</label>
          <select
            className="waiter-form__select"
            value={formData.schedule}
            onChange={(e) => setFormData({...formData, schedule: e.target.value})}
          >
            <option value="">Seleccionar horario</option>
            <option value="morning">Mañana (6:00 - 14:00)</option>
            <option value="evening">Tarde (14:00 - 22:00)</option>
            <option value="night">Noche (22:00 - 6:00)</option>
          </select>
        </div>
      </div>

      <div className="waiter-form__group">
        <label className="waiter-form__label">Dirección</label>
        <textarea
          className="waiter-form__textarea"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
      </div>

      <div className="waiter-form__group">
        <label className="waiter-form__checkbox-label">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          />
          Mesero Activo
        </label>
      </div>

      {!waiter && (
        <div className="waiter-form__group">
          <label className="waiter-form__label">Contraseña</label>
          <input
            type="password"
            className={`waiter-form__input ${errors.password ? 'waiter-form__input--error' : ''}`}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          {errors.password && <span className="waiter-form__error">{errors.password}</span>}
        </div>
      )}

      <div className="waiter-form__actions">
        <button type="submit" className="waiter-form__submit">
          {waiter ? 'Actualizar Mesero' : 'Registrar Mesero'}
        </button>
        <button 
          type="button" 
          className="waiter-form__cancel"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default WaiterForm;

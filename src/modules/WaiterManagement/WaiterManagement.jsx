import React, { useState, useEffect } from 'react';
import './WaiterManagement.scss';
import WaiterCard from './components/WaiterCard/WaiterCard';
import WaiterForm from './components/WaiterForm/WaiterForm';
import { waiterService } from '../../services/waiterService';

const WaiterManagement = () => {
  const [waiters, setWaiters] = useState([]);
  const [selectedWaiter, setSelectedWaiter] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWaiters();
  }, []);

  const loadWaiters = async () => {
    try {
      const data = await waiterService.getAll();
      setWaiters(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error al cargar los meseros');
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedWaiter) {
        const updatedWaiter = await waiterService.update(selectedWaiter._id, formData);
        setWaiters(waiters.map(waiter => 
          waiter._id === selectedWaiter._id ? updatedWaiter : waiter
        ));
      } else {
        const newWaiter = await waiterService.create(formData);
        setWaiters([...waiters, newWaiter]);
      }
      setIsFormVisible(false);
      setSelectedWaiter(null);
    } catch (err) {
      setError('Error al guardar el mesero');
      console.error(err);
    }
  };

  const handleEdit = (waiter) => {
    setSelectedWaiter(waiter);
    setIsFormVisible(true);
  };

  const handleToggleActive = async (id) => {
    try {
      const waiter = waiters.find(w => w._id === id);
      const updatedWaiter = await waiterService.toggleActive(id, !waiter.isActive);
      setWaiters(waiters.map(w => 
        w._id === id ? updatedWaiter : w
      ));
    } catch (err) {
      setError('Error al actualizar el estado del mesero');
      console.error(err);
    }
  };

  const filteredWaiters = showInactive 
    ? waiters 
    : waiters.filter(waiter => waiter.isActive);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="waiter-management">
      <header className="waiter-management__header">
        <h1 className="waiter-management__title">Gestión de Meseros</h1>
        <div className="waiter-management__actions">
          <label className="waiter-management__toggle">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
            Mostrar Inactivos
          </label>
          <button 
            className="waiter-management__add-button"
            onClick={() => {
              setSelectedWaiter(null);
              setIsFormVisible(true);
            }}
          >
            Nuevo Mesero
          </button>
        </div>
      </header>

      {isFormVisible && (
        <WaiterForm 
          waiter={selectedWaiter}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormVisible(false);
            setSelectedWaiter(null);
          }}
        />
      )}

      <div className="waiter-management__list">
        {filteredWaiters.map(waiter => (
          <WaiterCard
            key={waiter.id}
            waiter={waiter}
            onEdit={handleEdit}
            onToggleActive={handleToggleActive}
          />
        ))}
      </div>
    </div>
  );
};

export default WaiterManagement;
import React, { useState, useEffect } from 'react';
import './OrderForm.scss';
import { dishService } from '../../../../services/dishService';
import { clientService } from '../../../../services/clientService';
import { waiterService } from '../../../../services/waiterService';

const OrderForm = ({ order, onSubmit, onCancel }) => {

  const AVAILABLE_TABLES = [
    { id: 1, number: '1' },
    { id: 2, number: '2' },
    { id: 3, number: '3' },
    { id: 4, number: '4' },
    { id: 5, number: '5' },
    { id: 6, number: '6' },
    { id: 7, number: '7' },
    { id: 8, number: '8' },
    { id: 9, number: '9' },
    { id: 10, number: '10' }
  ];

  const [formData, setFormData] = useState({
    tableNumber: order ? order.tableNumber : '',
    items: order ? order.items.map(item => ({
      dishId: item.dishId._id,
      dishName: item.dishId.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    })) : [],
    status: order ? order.status : 'pending',
    clientId: order ? order.clientId._id : '',
    waiterId: order ? order.waiterId._id : '',
    notes: order ? order.notes : ''
  });

  const [availableDishes, setAvailableDishes] = useState([]);
  const [clients, setClients] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [selectedDish, setSelectedDish] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dishesResponse, clientsResponse, waitersResponse] = await Promise.all([
          dishService.getAll(),
          clientService.getAll(),
          waiterService.getAll(),
        ]);

        setAvailableDishes(dishesResponse);
        setClients(clientsResponse);
        setWaiters(waitersResponse);
        setIsLoading(false);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      }
    };

    fetchData();
  }, []);


  const addItem = () => {
    if (selectedDish) {
      const dish = availableDishes.find(d => d._id === selectedDish);
      const newItem = {
        dishId: dish._id,
        dishName: dish.name,
        quantity: quantity,
        price: dish.price,
        subtotal: dish.price * quantity
      };

      setFormData({
        ...formData,
        items: [...formData.items, newItem]
      });

      setSelectedDish('');
      setQuantity(1);
    }
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      total: calculateTotal(),
      date: new Date().toISOString()
    });
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="order-form__group">
        <label className="order-form__label">Mesa</label>
        <select
          className="order-form__select"
          value={formData.tableNumber}
          onChange={(e) => setFormData({...formData, tableNumber: Number(e.target.value)})}
          required
        >
          <option value="">Seleccionar Mesa</option>
          {AVAILABLE_TABLES.map(table => (
            <option key={table.id} value={table.number}>
              Mesa {table.number}
            </option>
          ))}
        </select>
      </div>

      <div className="order-form__group">
        <label className="order-form__label">Cliente</label>
        <select
          className="order-form__select"
          value={formData.clientId}
          onChange={(e) => setFormData({...formData, clientId: e.target.value})}
          required
        >
          <option value="">Seleccionar Cliente</option>
          {clients.map(client => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div className="order-form__group">
        <label className="order-form__label">Mesero</label>
        <select
          className="order-form__select"
          value={formData.waiterId}
          onChange={(e) => setFormData({...formData, waiterId: e.target.value})}
          required
        >
          <option value="">Seleccionar Mesero</option>
          {waiters.map(waiter => (
            <option key={waiter._id} value={waiter._id}>
              {waiter.name}
            </option>
          ))}
        </select>
      </div>

      <div className="order-form__items">
        <h3>Platillos</h3>
        <div className="order-form__add-item">
          {isLoading ? (
            <p>Cargando platillos...</p>
          ) : error ? (
            <p className="order-form__error">{error}</p>
          ) : (
            <select
              className="order-form__select"
              value={selectedDish}
              onChange={(e) => setSelectedDish(e.target.value)}
            >
              <option value="">Seleccionar Platillo</option>
              {availableDishes.map(dish => (
                <option key={dish._id} value={dish._id}>
                  {dish.name} - ${dish.price}
                </option>
              ))}
            </select>
          )}
          <input
            type="number"
            className="order-form__quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min="1"
          />
          <button
            type="button"
            className="order-form__add-button"
            onClick={addItem}
          >
            Agregar
          </button>
        </div>

        <div className="order-form__items-list">
          {formData.items.map((item, index) => (
            <div key={index} className="order-form__item">
              <span>{item.dishName}</span>
              <span>x{item.quantity}</span>
              <span>${item.subtotal.toFixed(2)}</span>
              <button
                type="button"
                className="order-form__remove-button"
                onClick={() => removeItem(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="order-form__total">
          Total: ${calculateTotal().toFixed(2)}
        </div>
      </div>

      <div className="order-form__group">
        <label className="order-form__label">Estado</label>
        <select
          className="order-form__select"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
        >
          <option value="pending">Pendiente</option>
          <option value="preparing">En Preparación</option>
          <option value="ready">Listo</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <div className="order-form__group">
        <label className="order-form__label">Notas</label>
        <textarea
          className="order-form__textarea"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Instrucciones especiales o notas adicionales"
        />
      </div>

      <div className="order-form__actions">
        <button type="submit" className="order-form__submit">
          {order ? 'Actualizar Orden' : 'Crear Orden'}
        </button>
        <button
          type="button"
          className="order-form__cancel"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default OrderForm;

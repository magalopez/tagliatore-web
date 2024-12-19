import { useState, useEffect } from "react";
import OrderCard from "./components/OrderCard/OrderCard";
import OrderForm from "./components/OrderForm/OrderForm";

import './OrderManagement.scss';
import { orderService } from "../../services/orderService";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error al cargar las órdenes');
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedOrder) {
        const updatedOrder = await orderService.update(selectedOrder._id, formData);
        setOrders(orders.map(order => 
          order._id === selectedOrder._id ? updatedOrder : order
        ));
      } else {
        const newOrder = await orderService.create(formData);
        setOrders([...orders, newOrder]);
      }
      setIsFormVisible(false);
      setSelectedOrder(null);
    } catch (err) {
      setError('Error al guardar la orden');
      console.error(err);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderService.updateStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? updatedOrder : order
      ));
    } catch (err) {
      setError('Error al actualizar el estado');
      console.error(err);
    }
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta orden?')) {
      setOrders(orders.filter(order => order.id !== id));
    }
  };

  return (
    <div className="order-management">
      <header className="order-management__header">
        <h1 className="order-management__title">Gestión de Órdenes</h1>
        <button 
          className="order-management__add-button"
          onClick={() => setIsFormVisible(true)}
        >
          Nueva Orden
        </button>
      </header>

      {isFormVisible && (
        <OrderForm
          order={selectedOrder}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormVisible(false);
            setSelectedOrder(null);
          }}
        />
      )}

      <div className="order-management__list">
        {orders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;
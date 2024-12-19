import { useState, useEffect } from 'react';
import ClientList from './components/ClientList/ClientList';
import ClientForm from './components/ClientForm/ClientForm';
import { clientService } from '../../services/clientService';
import './ClientManagement.scss';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error(err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedClient) {
        const updatedClient = await clientService.update(selectedClient._id, formData);
        setClients(clients.map(client => 
          client._id === selectedClient._id ? updatedClient : client
        ));
      } else {
        const newClient = await clientService.create(formData);
        setClients([...clients, newClient]);
      }
      setIsFormVisible(false);
      setSelectedClient(null);
    } catch (err) {
      setError('Error al guardar el cliente');
      console.error(err);
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await clientService.delete(id);
        setClients(clients.filter(client => client._id !== id));
      } catch (err) {
        setError('Error al eliminar el cliente');
        console.error(err);
      }
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="client-management">
      <header className="client-management__header">
        <h1 className="client-management__title">Gestión de Clientes</h1>
        <button 
          className="client-management__add-button"
          onClick={() => {
            setSelectedClient(null);
            setIsFormVisible(true);
          }}
        >
          Registrar Nuevo Cliente
        </button>
      </header>

      {error && <div className="client-management__error">{error}</div>}

      {isFormVisible && (
        <ClientForm 
          client={selectedClient}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormVisible(false);
            setSelectedClient(null);
          }}
        />
      )}

      <ClientList
        clients={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ClientManagement;

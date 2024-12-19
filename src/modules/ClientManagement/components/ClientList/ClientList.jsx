import ClientCard from '../ClientCard/ClientCard';
import './ClientList.scss';

const ClientList = ({ clients, onEdit, onDelete }) => {
  return (
    <div className="client-list">
      {clients.map(client => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ClientList;

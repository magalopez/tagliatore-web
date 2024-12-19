import { useState, useEffect } from "react";
import CategoryCard from "./components/CategoryCard/CategoryCard";
import CategoryForm from "./components/CategoryForm/CategoryForm";
import { categoryService } from '../../services/categoryService';
import './CategoryManagement.scss';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedCategory) {
        const updatedCategory = await categoryService.update(selectedCategory._id, formData);
        setCategories(categories.map(cat => 
          cat._id === selectedCategory._id ? updatedCategory : cat
        ));
      } else {
        const newCategory = await categoryService.create(formData);
        setCategories([...categories, newCategory]);
      }
      setIsFormVisible(false);
      setSelectedCategory(null);
    } catch (err) {
      setError('Error al guardar la categoría');
      console.error(err);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    const categoryToDelete = categories.find(cat => cat._id === id);
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryToDelete.name}"?`)) {
      try {
        await categoryService.delete(id);
        setCategories(categories.filter(category => category._id !== id));
      } catch (err) {
        setError('Error al eliminar la categoría');
        console.error(err);
      }
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="category-management">
      <header className="category-management__header">
        <h1 className="category-management__title">Gestión de Categorías</h1>
        <button 
          className="category-management__add-button"
          onClick={() => {
            setSelectedCategory(null);
            setIsFormVisible(true);
          }}
        >
          Nueva Categoría
        </button>
      </header>

      {isFormVisible && (
        <CategoryForm 
          category={selectedCategory}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormVisible(false);
            setSelectedCategory(null);
          }}
        />
      )}

      <div className="category-management__list">
        {categories.map(category => (
          <CategoryCard
            key={category._id}
            category={category}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;

import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Подключаем CSS-файл для стилизации

const AddProduct = ({ onProductAdded }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5004/add', { url });
      setUrl('');
      alert('Продукт успешно добавлен!');
      if (response.status === 200 && onProductAdded) {
        onProductAdded();
      }
    } catch (error) {
      setError('Ошибка добавления');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-product">
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            disabled={isLoading}
            required
          />
        </label>
        <button type="submit" disabled={isLoading} label={""}>
          {isLoading ? 'Добавление...' : 'Добавит продукт конкурента'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AddProduct;

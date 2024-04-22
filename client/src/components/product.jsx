import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PriceHistory from './PriceHistory'; // Импортируем компонент с историей цен

const Product = ({ id, url, title, price, updatedAt }) => {
  const [expanded, setExpanded] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5004/pricehistory/${id}`);
        setPriceHistory(response.data);
      } catch (error) {
        console.error('Проблема с запросом по истории цен:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, []);
  const handleToggleExpand = () => {
    setExpanded(prevExpanded => !prevExpanded);
  };

  return (
    <div className="product">
      <div className="product-header">
        <h3>{title}</h3>
        <p>Текущая цена: {price}</p>
        <p>Последнее обновление: {new Date(updatedAt).toLocaleString()}</p>
        <a href={url}>Ссылка на товар</a>
        <button onClick={handleToggleExpand}>
          {expanded ? 'Скрыть историю цен' :'Показать историю цен' }
        </button>
      </div>
      {expanded && <PriceHistory priceHistory={priceHistory} />} 
    </div>
  );
};

export default Product;

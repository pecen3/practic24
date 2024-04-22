import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'
import Product from './product';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5004/all');
        console.log(response.data)
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchData();
  
  }, []);

  return (
    <div className="product-list">
      {products.map(product => (
        
        <Product id={product.id} title={product.title} price={product.price} updatedAt={product.updated_at} url={product.url}/>
      ))}
  
    </div>
  );
};

export default ProductList;

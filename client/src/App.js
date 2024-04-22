
import './App.css';
import AddProduct from './components/AddProduct';
import Product from './components/product';
import ProductList from './components/ProductList';
function App() {
  return (
    <div className="App">
      <h1 className='h1'>Price Watcher</h1>
      <AddProduct/>
      <ProductList/>
   
    </div>
  );
}

 
export default App;

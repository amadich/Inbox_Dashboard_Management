

import { FC } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductTableProps {
  products: Product[];
  onEditProduct: (id: number) => void;
  onDeleteProduct: (id: number) => void;
}

const ProductTable: FC<ProductTableProps> = ({ products, onEditProduct, onDeleteProduct }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          stock={product.stock}
          onEdit={() => onEditProduct(product.id)}
          onDelete={() => onDeleteProduct(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductTable;

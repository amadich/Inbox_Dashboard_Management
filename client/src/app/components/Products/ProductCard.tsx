

import { FC } from 'react';

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  stock: number;
  onEdit: () => void;
  onDelete: () => void;
}

const ProductCard: FC<ProductCardProps> = ({ name, description, price, stock, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden p-4 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-sm font-semibold text-gray-800 mt-2">Price: ${price.toFixed(2)}</p>
      <p className="text-sm text-gray-600">Stock: {stock}</p>

      <div className="mt-4 flex justify-between">
        <button
          onClick={onEdit}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;



import { FC } from 'react';

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  description: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const EventCard: FC<EventCardProps> = ({ id, title, date, description, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden p-4 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{date}</p>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onEdit(id)}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(id)}
          className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EventCard;

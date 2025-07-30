

import { FC } from 'react';
import EventCard from './EventCard';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

interface EventListProps {
  events: Event[];
  onEditEvent: (id: number) => void;
  onDeleteEvent: (id: number) => void;
}

const EventList: FC<EventListProps> = ({ events, onEditEvent, onDeleteEvent }) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.title}
          date={event.date}
          description={event.description}
          onEdit={onEditEvent}
          onDelete={onDeleteEvent}
        />
      ))}
    </div>
  );
};

export default EventList;

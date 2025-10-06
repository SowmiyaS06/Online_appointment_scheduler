import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../context/AuthContext';

const localizer = momentLocalizer(moment);

const AppointmentCalendar = ({ appointments, onEventSelect, onSlotSelect }) => {
  const { user } = useAuth();
  const [view, setView] = useState('month');

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    
    switch (event.status) {
      case 'confirmed':
        backgroundColor = '#10B981';
        break;
      case 'cancelled':
        backgroundColor = '#EF4444';
        break;
      case 'completed':
        backgroundColor = '#8B5CF6';
        break;
      default:
        backgroundColor = '#F59E0B';
    }

    const style = {
      backgroundColor,
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };

    return {
      style
    };
  };

  const formats = {
    dateFormat: 'D',
    dayFormat: 'ddd D',
    monthHeaderFormat: 'MMMM YYYY',
    dayHeaderFormat: 'dddd, MMMM D',
    agendaHeaderFormat: 'ddd, MMM D - MMMM D',
    agendaDateFormat: 'ddd, MMM D',
    agendaTimeFormat: 'h:mm A',
    agendaTimeRangeFormat: ({ start, end }) => 
      `${moment(start).format('h:mm A')} - ${moment(end).format('h:mm A')}`,
  };

  return (
    <div className="h-full">
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day', 'agenda']}
        view={view}
        onView={setView}
        onNavigate={(date) => console.log('Navigate', date)}
        onSelectEvent={onEventSelect}
        onSelectSlot={user?.role === 'patient' ? onSlotSelect : undefined}
        selectable={user?.role === 'patient'}
        eventPropGetter={eventStyleGetter}
        formats={formats}
        messages={{
          next: 'Next',
          previous: 'Back',
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          agenda: 'Agenda',
          date: 'Date',
          time: 'Time',
          event: 'Appointment',
          showMore: (total) => `+${total} more`
        }}
        components={{
          event: ({ event }) => (
            <div className="px-2 py-1 text-xs">
              <div className="font-medium truncate">{event.title}</div>
              <div className="truncate">{event.time}</div>
            </div>
          )
        }}
      />
    </div>
  );
};

export default AppointmentCalendar;
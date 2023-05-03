import { createContext, useState } from 'react';

const CalendarContext = createContext({
  calendars: [],
  setCalendars: () => {},
});

export const CalendarProvider = ({ children }) => {
  const [calendars, setCalendars] = useState([]);

  return (
    <CalendarContext.Provider value={{ calendars, setCalendars }}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContext;
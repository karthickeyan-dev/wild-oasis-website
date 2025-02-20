"use client";

import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();

export function ReservationProvider({ children }) {
  const initialState = { from: undefined, to: undefined };
  const [range, setRange] = useState(initialState);

  function resetRange() {
    setRange(initialState);
  }

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const context = useContext(ReservationContext);
  if (!context)
    throw new Error("useReservation was used outside ReservationProvider");

  return context;
}

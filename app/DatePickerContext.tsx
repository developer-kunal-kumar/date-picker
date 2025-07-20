"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types for the recurring date picker
export interface RecurringDate {
  startDate: Date;
  endDate?: Date;
  recurrenceType: "none" | "daily" | "weekly" | "monthly" | "yearly";
  weeklyDays?: number[]; // 0-6 (Sunday-Saturday)
  monthlyDay?: number; // 1-31
  monthlyWeek?: number; // 1-5 (first, second, etc.)
  monthlyWeekDay?: number; // 0-6 (Sunday-Saturday)
  yearlyMonth?: number; // 0-11 (January-December)
  yearlyDay?: number; // 1-31
  occurrences?: number;
  neverEnds: boolean;
}

interface DatePickerContextType {
  selectedDate: RecurringDate;
  setSelectedDate: (date: RecurringDate) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  updateDate: (updates: Partial<RecurringDate>) => void;
}

const defaultDate: RecurringDate = {
  startDate: new Date(),
  recurrenceType: "none",
  neverEnds: true,
  weeklyDays: [],
  monthlyDay: 1,
  monthlyWeek: 1,
  monthlyWeekDay: 0,
  yearlyMonth: 0,
  yearlyDay: 1,
  occurrences: 1,
};

const DatePickerContext = createContext<DatePickerContextType | undefined>(
  undefined
);

export const useDatePicker = () => {
  const context = useContext(DatePickerContext);
  if (context === undefined) {
    throw new Error("useDatePicker must be used within a DatePickerProvider");
  }
  return context;
};

interface DatePickerProviderProps {
  children: ReactNode;
  initialValue?: RecurringDate;
  onChange?: (date: RecurringDate) => void;
}

export const DatePickerProvider: React.FC<DatePickerProviderProps> = ({
  children,
  initialValue = defaultDate,
  onChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<RecurringDate>(initialValue);
  const [isOpen, setIsOpen] = useState(false);

  const updateDate = (updates: Partial<RecurringDate>) => {
    const newDate = { ...selectedDate, ...updates };
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const value: DatePickerContextType = {
    selectedDate,
    setSelectedDate,
    isOpen,
    setIsOpen,
    updateDate,
  };

  return (
    <DatePickerContext.Provider value={value}>
      {children}
    </DatePickerContext.Provider>
  );
};

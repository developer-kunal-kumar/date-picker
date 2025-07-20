"use client";

import DatePicker from "./DatePicker";
import { DatePickerProvider } from "./DatePickerContext";

export default function Home() {
  return (
    <DatePickerProvider
      onChange={(date) => {
        console.log("Selected recurring date:", date);
      }}
    >
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <h1 className="text-4xl font-bold pl-20 pr-20">Date Picker</h1>

          <div className="w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Select Recurring Date</h2>
            <DatePicker placeholder="Choose your recurring date..." />
          </div>
        </main>
      </div>
    </DatePickerProvider>
  );
}

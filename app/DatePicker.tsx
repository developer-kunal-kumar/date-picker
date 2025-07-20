"use client";

import { useDatePicker, RecurringDate } from "./DatePickerContext";

interface DatePickerProps {
  className?: string;
  placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  className = "",
  placeholder = "Select recurring date",
}) => {
  const { selectedDate, isOpen, setIsOpen, updateDate } = useDatePicker();

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDisplayText = (): string => {
    if (!selectedDate.startDate) return placeholder;

    let text = formatDate(selectedDate.startDate);

    if (selectedDate.recurrenceType !== "none") {
      text += ` (${selectedDate.recurrenceType}`;

      if (
        selectedDate.recurrenceType === "weekly" &&
        selectedDate.weeklyDays?.length
      ) {
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const selectedDays = selectedDate.weeklyDays
          .map((day) => dayNames[day])
          .join(", ");
        text += `: ${selectedDays}`;
      } else if (selectedDate.recurrenceType === "monthly") {
        if (
          selectedDate.monthlyWeek &&
          selectedDate.monthlyWeekDay !== undefined
        ) {
          const weekNames = ["1st", "2nd", "3rd", "4th", "5th"];
          const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          text += `: ${weekNames[selectedDate.monthlyWeek - 1]} ${
            dayNames[selectedDate.monthlyWeekDay]
          }`;
        } else {
          text += `: day ${selectedDate.monthlyDay}`;
        }
      } else if (selectedDate.recurrenceType === "yearly") {
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        text += `: ${monthNames[selectedDate.yearlyMonth || 0]} ${
          selectedDate.yearlyDay
        }`;
      }

      text += ")";
    }

    return text;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    updateDate({ startDate: newDate });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    updateDate({ endDate: newDate });
  };

  const toggleWeeklyDay = (day: number) => {
    const currentDays = selectedDate.weeklyDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort();
    updateDate({ weeklyDays: newDays });
  };

  const weekDays = [
    { value: 0, label: "Sun" },
    { value: 1, label: "Mon" },
    { value: 2, label: "Tue" },
    { value: 3, label: "Wed" },
    { value: 4, label: "Thu" },
    { value: 5, label: "Fri" },
    { value: 6, label: "Sat" },
  ];

  const weekOptions = [
    { value: 1, label: "1st" },
    { value: 2, label: "2nd" },
    { value: 3, label: "3rd" },
    { value: 4, label: "4th" },
    { value: 5, label: "5th" },
  ];

  const monthOptions = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
      >
        <span className="block truncate">{getDisplayText()}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-4 space-y-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={selectedDate.startDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>

            {/* Recurrence Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recurrence
              </label>
              <select
                value={selectedDate.recurrenceType}
                onChange={(e) =>
                  updateDate({
                    recurrenceType: e.target
                      .value as RecurringDate["recurrenceType"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="none">No Recurrence</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* Weekly Options */}
            {selectedDate.recurrenceType === "weekly" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days of Week
                </label>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleWeeklyDay(day.value)}
                      className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                        selectedDate.weeklyDays?.includes(day.value)
                          ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Monthly Options */}
            {selectedDate.recurrenceType === "monthly" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Pattern
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="monthlyPattern"
                        checked={!selectedDate.monthlyWeek}
                        onChange={() => updateDate({ monthlyWeek: undefined })}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Day of month
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="monthlyPattern"
                        checked={!!selectedDate.monthlyWeek}
                        onChange={() =>
                          updateDate({ monthlyWeek: 1, monthlyWeekDay: 0 })
                        }
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Week of month
                      </span>
                    </label>
                  </div>
                </div>

                {!selectedDate.monthlyWeek ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day of Month
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={selectedDate.monthlyDay}
                      onChange={(e) =>
                        updateDate({ monthlyDay: parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Week
                      </label>
                      <select
                        value={selectedDate.monthlyWeek}
                        onChange={(e) =>
                          updateDate({ monthlyWeek: parseInt(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      >
                        {weekOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Day
                      </label>
                      <select
                        value={selectedDate.monthlyWeekDay}
                        onChange={(e) =>
                          updateDate({
                            monthlyWeekDay: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      >
                        {weekDays.map((day) => (
                          <option key={day.value} value={day.value}>
                            {day.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Yearly Options */}
            {selectedDate.recurrenceType === "yearly" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <select
                    value={selectedDate.yearlyMonth}
                    onChange={(e) =>
                      updateDate({ yearlyMonth: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  >
                    {monthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={selectedDate.yearlyDay}
                    onChange={(e) =>
                      updateDate({ yearlyDay: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            {/* End Options */}
            {selectedDate.recurrenceType !== "none" && (
              <div className="space-y-3">
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="endType"
                      checked={selectedDate.neverEnds}
                      onChange={() =>
                        updateDate({ neverEnds: true, endDate: undefined })
                      }
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Never ends</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="endType"
                      checked={!selectedDate.neverEnds}
                      onChange={() => updateDate({ neverEnds: false })}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Ends on</span>
                  </label>
                </div>

                {!selectedDate.neverEnds && (
                  <div>
                    <input
                      type="date"
                      value={
                        selectedDate.endDate?.toISOString().split("T")[0] || ""
                      }
                      onChange={handleEndDateChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;

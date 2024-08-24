import React, { useState, useCallback } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateTimePicker({ onDateChange }) {
  // Mengatur rentang tanggal default dari tanggal 1 hingga akhir bulan saat ini
  const initialDateRange = {
    from: startOfMonth(new Date()), // Tanggal 1 bulan ini
    to: endOfMonth(new Date()), // Tanggal terakhir bulan ini
  };

  const [date, setDate] = useState(initialDateRange);

  const handleDateChange = useCallback(
    (newDate) => {
      if (newDate?.from && newDate?.to) {
        setDate(newDate);
        if (onDateChange) {
          onDateChange(newDate.from, newDate.to);
        }
      }
    },
    [onDateChange]
  );

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[300px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from && date?.to
              ? `${format(date.from, "LLL dd, yyyy")} - ${format(
                  date.to,
                  "LLL dd, yyyy"
                )}`
              : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

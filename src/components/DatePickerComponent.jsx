"use client";

import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

export const DatePickerComponent = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate ? newDate.toDate() : null);
    onDateSelect(newDate ? newDate.toDate() : null); // Pass the date to the parent component
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Select Date"
        value={selectedDate}
        onChange={handleDateChange}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderColor: "white", // Change the border color to white
              },
              "& .MuiInputLabel-root": {
                color: "white", // Change the label color to white
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DatePickerComponent;

import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { MedContext } from "../context/MedContext";
import { useContext } from "react";
import dayjs from "dayjs";

export default function Calendar() {
  const { selectedDate, setSelectedDate } = useContext(MedContext);
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    console.log("Selected Date:", newDate.format("YYYY-MM-DD"));
  };

  return (
    <div className="calendar-container w-full overflow-y-auto overflow-x-hidden ">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate ? dayjs(selectedDate) : null}
          onChange={handleDateChange}
          sx={{
            '.MuiPickersDay-root': {
              fontSize: '0.8rem',
            }
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
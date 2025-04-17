import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { MedContext } from "../context/MedContext";
import { useContext } from "react";
import dayjs from "dayjs";

const Calendar = ({ isExpanded }) => {
  const { selectedDate, setSelectedDate } = useContext(MedContext);
  
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    console.log("Selected Date:", newDate.format("YYYY-MM-DD"));
  };

  return (
    <div className={`w-full ${isExpanded ? 'px-0' : 'px-0'}`}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate ? dayjs(selectedDate) : null}
          onChange={handleDateChange}
          className="w-full"
          sx={{
            width: '100%',
            maxWidth: '100%',
            '& .MuiPickersCalendarHeader-root': {
              paddingLeft: '8px',
              paddingRight: '8px',
            },
            '& .MuiPickersCalendarHeader-labelContainer': {
              // margin: '0 auto',
            },
            '& .MuiDayCalendar-header': {
              justifyContent: 'space-between',
              // padding: '0 8px',
            },
            '& .MuiPickersDay-root': {
              width: '28px',
              height: '28px',
              fontSize: '0.75rem',
              margin: '0 2px',
            },
            '& .MuiDayCalendar-weekContainer': {
              justifyContent: 'space-between',
              margin: '2px 0',
            },
            '& .MuiPickersCalendarHeader-switchViewButton': {
              display: 'none',
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default Calendar;
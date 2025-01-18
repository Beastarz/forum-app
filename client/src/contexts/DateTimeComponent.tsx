const DateTimeComponent = (time: any) => {
  const isoDateString = time;
  const date = new Date(isoDateString);
  const readableFormat = date.toLocaleString("ENG-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return readableFormat;
};

export default DateTimeComponent;

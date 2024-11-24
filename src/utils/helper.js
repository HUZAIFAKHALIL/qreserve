export const stringToDate = (date) => {
  const dt = new Date(date);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  };

  const formattedDate = dt.toLocaleDateString("en-US", options);
  console.log(formattedDate);
  return formattedDate;
};

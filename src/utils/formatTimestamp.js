function formatTimestamp(timestamp) {
  const currentDate = new Date();
  const date = new Date(timestamp);
  const diffTime = currentDate - date;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Check if the date part of the timestamp is the same as today's date
  const isToday = date.getDate() === currentDate.getDate() &&
                  date.getMonth() === currentDate.getMonth() &&
                  date.getFullYear() === currentDate.getFullYear();

  if (isToday) {
    // Today
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays <= 7) {
    // Within a week, show day name in short
    const options = { weekday: "short" };
    return date.toLocaleDateString("en-US", options);
  } else if (diffDays <= 365) {
    // Within a year, show date and month name
    const options = { day: "2-digit", month: "short" };
    return date.toLocaleDateString("en-US", options);
  } else {
    // More than a year, show month name and year
    const options = { year: "numeric", month: "short" };
    return date.toLocaleDateString("en-US", options);
  }
}

export default formatTimestamp;

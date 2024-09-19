const { fromZonedTime, toZonedTime, format } = require("date-fns-tz");

// Convert a date from a given time zone to UTC.
const convertToUTC = (date, timeZone) => {
  return fromZonedTime(date, timeZone);
};

// Converts a date from UTC to a given time zone.
const convertFromUTC = (date, timeZone) => {
  return format(toZonedTime(date, timeZone), "yyyy-MM-dd HH:mm:ssXXX", {
    timeZone,
  });
};

module.exports = { convertToUTC, convertFromUTC };

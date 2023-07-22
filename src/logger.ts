import pkg from "winston";

const { createLogger, format, transports } = pkg;
const { combine, printf } = format;

const getISTTimestamp = () => {
    const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} (IST)`;
  return formattedDateTime;
};

export const logger = createLogger({
  format: combine(
    printf(({ level, message }) => {
      return `${getISTTimestamp()} ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Output logs to the console
    new transports.File({ filename: "logs.log" }), // Output logs to a file
  ],
});

type FormattedDate = {
  date: string;
  time: string;
};

export function formatDate(date: number): FormattedDate {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();
  let time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return {
    date: `${[month, day, year].join("/")}`,
    time,
  };
}

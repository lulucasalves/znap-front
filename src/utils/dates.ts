export function formatDate(date: string) {
  const data = new Date(date);

  const zeroPad = (num: number) => (num < 10 ? `0${num}` : num.toString());

  const day = zeroPad(data.getDate());
  const month = zeroPad(data.getMonth() + 1);
  const year = data.getFullYear();
  const hours = zeroPad(data.getHours());
  const minutes = zeroPad(data.getMinutes());

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

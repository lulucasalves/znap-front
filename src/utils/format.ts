export function formatMoney(value: number) {
  const formatoMoeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return formatoMoeda.format(value).includes("NaN")
    ? "R$ 0,00"
    : formatoMoeda.format(value);
}

export function parseMoney(valueString: string) {
  const numericString = valueString.replace(/[^\d.,]/g, "").replace(".", "");

  const numericValue = parseFloat(numericString.replace(",", "."));

  return isNaN(numericValue) ? 0 : numericValue;
}

export function formatDateOrder(value: string) {
  const [year, month, day] = value.split("-");

  return `${day}/${month}/${year}`;
}

export function formatDateOrderSend(value: string) {
  try {
    const [day, month, year] = value.split("/");

    if (day && month && year) return `${year}-${month}-${day}`;

    return "";
  } catch (err) {
    return "";
  }
}

export function getCurrentDate() {
  const currentDate = new Date();

  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Os meses são indexados de 0 a 11
  const year = currentDate.getFullYear();

  return `${day}/${month}/${year}`;
}

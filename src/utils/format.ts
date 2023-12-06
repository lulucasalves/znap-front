export function formatMoney(value: number) {
  const formatoMoeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return formatoMoeda.format(value);
}

export function parseMoney(valueString: string) {
  const numericString = valueString.replace(/[^\d.,]/g, "").replace(".", "");

  const numericValue = parseFloat(numericString.replace(",", "."));

  return isNaN(numericValue) ? 0 : numericValue;
}

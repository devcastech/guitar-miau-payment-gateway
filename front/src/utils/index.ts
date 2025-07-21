
export const formatCurrency = (amount: number, currency: string = "COP") => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};


  export const getIntegrity = async (BASE_STRING: string) => {
    const encondedText = new TextEncoder().encode(BASE_STRING);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex; 
  };
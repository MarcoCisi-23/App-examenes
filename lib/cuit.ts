/** Deja solo dígitos, útil para normalizar antes de guardar/comparar un CUIT. */
export function normalizeCuit(value: string): string {
  return value.replace(/\D/g, "");
}

/** Formatea dígitos sueltos al patrón NN-NNNNNNNN-N a medida que se escriben. */
export function formatCuit(value: string): string {
  const digits = normalizeCuit(value).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10, 11)}`;
}

export function isCompleteCuit(value: string): boolean {
  return normalizeCuit(value).length === 11;
}

import { differenceInYears } from "date-fns";

export function calcularEdad(fechaNacimiento: Date): number {
  return differenceInYears(new Date(), fechaNacimiento);
}

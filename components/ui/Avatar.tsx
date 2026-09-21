const SIZE_CLASSES = {
  sm: "w-11 h-11 font-label-lg text-label-lg",
  lg: "w-14 h-14 font-headline-sm text-headline-sm",
} as const;

export function Avatar({
  nombre,
  apellido,
  size = "sm",
}: {
  nombre: string;
  apellido: string;
  size?: keyof typeof SIZE_CLASSES;
}) {
  const iniciales = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  return (
    <div
      className={`shrink-0 rounded-full bg-primary-container text-on-primary flex items-center justify-center ${SIZE_CLASSES[size]}`}
    >
      {iniciales}
    </div>
  );
}

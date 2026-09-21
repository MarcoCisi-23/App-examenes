"use client";

export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex items-center">
      <span className="material-symbols-outlined absolute left-space-md text-outline text-[20px]">
        search
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[48px] pl-11 pr-11 rounded-lg bg-surface-container-low text-on-surface font-body-lg text-body-lg placeholder:text-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-2 w-9 h-9 flex items-center justify-center text-outline hover:text-primary"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
}

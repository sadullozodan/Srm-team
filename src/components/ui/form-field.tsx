import { cn } from "@/lib/utils";

// Small shared building blocks used across the create/edit forms.

export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={cn(
              "h-10 rounded-lg border px-4 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-secondary text-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

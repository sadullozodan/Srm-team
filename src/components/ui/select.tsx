"use client";

import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectCtx {
  value: string;
  onValueChange: (val: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Ctx = createContext<SelectCtx>({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
});

function CompoundSelect({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  children?: ReactNode;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);

  const currentValue = controlledValue ?? internalValue;

  const handleChange = (val: string) => {
    if (controlledValue === undefined) setInternalValue(val);
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <Ctx.Provider value={{ value: currentValue, onValueChange: handleChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </Ctx.Provider>
  );
}

function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "h-10 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent px-3 pr-9 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 dark:bg-input/30",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function Select({
  onChange,
  children,
  ...props
}: {
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  [key: string]: any;
}) {
  if (onChange) {
    return (
      <NativeSelect onChange={onChange} {...props}>
        {children}
      </NativeSelect>
    );
  }
  return (
    <CompoundSelect {...props}>
      {children}
    </CompoundSelect>
  );
}

function SelectTrigger({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}) {
  const ctx = useContext(Ctx);

  return (
    <button
      onClick={() => ctx.setOpen(!ctx.open)}
      data-state={ctx.open ? "open" : "closed"}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

function SelectValue({
  className,
  placeholder,
  ...props
}: {
  className?: string;
  placeholder?: string;
  [key: string]: any;
}) {
  const ctx = useContext(Ctx);
  return (
    <span className={cn("text-sm", className)} {...props}>
      {ctx.value || placeholder || "Select..."}
    </span>
  );
}

function SelectContent({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}) {
  const ctx = useContext(Ctx);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctx.open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        ctx.setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ctx.open, ctx.setOpen]);

  if (!ctx.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SelectItem({
  value,
  className,
  children,
  ...props
}: {
  value: string;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}) {
  const ctx = useContext(Ctx);
  const isSelected = ctx.value === value;

  return (
    <button
      onClick={() => ctx.onValueChange(value)}
      data-selected={isSelected ? "true" : undefined}
      className={cn(
        "relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[selected]:bg-accent data-[selected]:text-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="mr-2 flex size-4 items-center justify-center">
        {isSelected && <Check className="size-3.5" />}
      </span>
      {children}
    </button>
  );
}

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };

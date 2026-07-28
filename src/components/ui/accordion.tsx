"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionCtx {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
}

const Ctx = createContext<AccordionCtx>({ value: "", onChange: () => {} });

interface AccordionProps {
  type: "single";
  collapsible?: boolean;
  defaultValue?: string;
  className?: string;
  children: ReactNode;
}

export function Accordion({
  type: _type,
  collapsible: _collapsible,
  defaultValue = "",
  className,
  children,
}: AccordionProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Ctx.Provider value={{ value, onChange: setValue }}>
      <div className={cn("space-y-4", className)}>{children}</div>
    </Ctx.Provider>
  );
}

interface AccordionItemContext {
  itemValue: string;
}

const ItemCtx = createContext<AccordionItemContext>({ itemValue: "" });

interface AccordionItemProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export function AccordionItem({ value, className, children }: AccordionItemProps) {
  const { value: ctxValue } = useContext(Ctx);
  const isOpen = ctxValue === value;

  return (
    <ItemCtx.Provider value={{ itemValue: value }}>
      <div
        data-state={isOpen ? "open" : "closed"}
        className={cn("overflow-hidden rounded-2xl border-none bg-card", className)}
      >
        {children}
      </div>
    </ItemCtx.Provider>
  );
}

interface AccordionTriggerProps {
  className?: string;
  children: ReactNode;
}

export function AccordionTrigger({ className, children }: AccordionTriggerProps) {
  const { value, onChange } = useContext(Ctx);
  const { itemValue } = useContext(ItemCtx);
  const isOpen = value === itemValue;

  return (
    <button
      onClick={() => onChange(isOpen ? "" : itemValue)}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "group flex w-full cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold hover:no-underline",
        className,
      )}
    >
      {children}
      <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
    </button>
  );
}

interface AccordionContentProps {
  className?: string;
  children: ReactNode;
}

export function AccordionContent({ className, children }: AccordionContentProps) {
  const { value } = useContext(Ctx);
  const { itemValue } = useContext(ItemCtx);
  const isOpen = value === itemValue;

  if (!isOpen) return null;

  return <div className={cn("px-5 pb-5", className)}>{children}</div>;
}

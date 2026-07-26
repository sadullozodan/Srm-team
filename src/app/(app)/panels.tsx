"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FilePlus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

// The design language the team's Figma is drawn in, shared by every page in
// the (app) group: one bordered panel per screen, a black-weight title, pill
// actions, and inputs whose label is notched into the top border once filled.
//
// It is written in the theme tokens rather than the Figma's literal slate and
// indigo — the Figma's indigo is this app's --primary — so the look carries
// into the dark theme instead of pinning white backgrounds.

/** The bordered card a screen sits on. */
export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full space-y-6 rounded-2xl border border-border bg-card p-5 text-foreground shadow-xs sm:p-7 md:rounded-3xl",
        className
      )}
      {...props}
    />
  );
}

export function PanelHeader({
  title,
  backHref,
  children,
}: {
  title: string;
  /** Shows the Figma's back arrow. Omit on a top-level page. */
  backHref?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Back"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-5 stroke-[2.5]" />
          </Link>
        )}
        <h1 className="text-xl font-black tracking-tight sm:text-2xl">{title}</h1>
      </div>

      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-extrabold sm:text-lg">{children}</h2>;
}

// Both actions render as a link when given an href and a button otherwise —
// the Figma uses the same pill for "go to Mentor levels" and for "EXPORT".
const actionBase =
  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold tracking-wider transition-all disabled:opacity-50";

function Action({
  className,
  href,
  children,
  ...props
}: React.ComponentProps<"button"> & { href?: string }) {
  if (href) {
    return (
      <Link href={href} className={cn(actionBase, className)}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cn(actionBase, className)} {...props}>
      {children}
    </button>
  );
}

/** Outlined uppercase action, the Figma's EXPORT treatment. */
export function OutlineAction(props: React.ComponentProps<"button"> & { href?: string }) {
  return (
    <Action
      {...props}
      className="border-2 border-primary text-primary shadow-xs hover:bg-primary/10"
    />
  );
}

export function PrimaryAction(props: React.ComponentProps<"button"> & { href?: string }) {
  return (
    <Action
      {...props}
      className="bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90"
    />
  );
}

export function ExportButton() {
  return (
    <OutlineAction>
      <Upload className="size-4 stroke-[2.5]" />
      <span>EXPORT</span>
    </OutlineAction>
  );
}

export const fieldCls =
  "w-full rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs font-medium text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";

/**
 * Wrapper that notches a small label into the top border. The Figma only shows
 * the label once the field has a value — until then the placeholder carries it,
 * so `always` is opt-in for filter bars where there is no placeholder.
 */
export function Field({
  label,
  filled = true,
  required,
  children,
}: {
  label: string;
  filled?: boolean;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {filled && (
        <span className="absolute -top-2.5 left-3 z-10 bg-card px-1 text-[11px] font-medium text-muted-foreground">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </span>
      )}
      <div className="relative flex items-center">{children}</div>
    </div>
  );
}

/** Text input carrying its own floating label, as the Figma's forms do. */
export function TextField({
  label,
  value,
  onChange,
  required,
  type = "text",
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "onChange" | "value"> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label} filled={value !== ""} required={required}>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={value ? "" : label}
        onChange={(e) => onChange(e.target.value)}
        className={cn(fieldCls, className)}
        {...props}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <Field label={label} filled={value !== ""}>
      <textarea
        value={value}
        rows={rows}
        placeholder={value ? "" : label}
        onChange={(e) => onChange(e.target.value)}
        className={cn(fieldCls, "resize-y")}
      />
    </Field>
  );
}

/** Number input with the Figma's stacked chevron stepper. */
export function NumberField({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
}) {
  const current = Number(value) || 0;
  const step = (delta: number) => onChange(String(Math.max(min, current + delta)));

  return (
    <Field label={label} filled={value !== ""}>
      <input
        type="number"
        min={min}
        value={value}
        placeholder={value ? "" : label}
        onChange={(e) => onChange(e.target.value)}
        className={cn(fieldCls, "pr-8")}
      />
      <div className="absolute right-2 flex flex-col">
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => step(1)}
          className="p-0.5 text-muted-foreground hover:text-foreground"
        >
          <ChevronUp className="size-3 stroke-[2.5]" />
        </button>
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => step(-1)}
          className="p-0.5 text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className="size-3 stroke-[2.5]" />
        </button>
      </div>
    </Field>
  );
}

import { CustomSelect } from "@/components/ui/custom-select";

/** Custom select box using CustomSelect component. Options are supplied as children or array. */
export function SelectBox({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const optionsList: { label: string; value: string }[] = [];
  if (children) {
    // Convert option elements to CustomSelectOption objects
    const childrenArray = Array.isArray(children) ? children : [children];
    childrenArray.forEach((child: any) => {
      if (child && child.props) {
        const val = child.props.value !== undefined ? String(child.props.value) : String(child.props.children);
        const lbl = String(child.props.children || val);
        optionsList.push({ label: lbl, value: val });
      }
    });
  }

  return (
    <CustomSelect
      label={label}
      value={value}
      onChange={onChange}
      options={optionsList}
      className="w-full"
    />
  );
}

export function SearchField({
  value,
  onChange,
  label = "Search",
  placeholder = "Search by name",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <Search className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(fieldCls, "pl-9")}
      />
    </Field>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  allLabel,
}: {
  label: string;
  value: T | "";
  options: readonly T[];
  onChange: (value: T | "") => void;
  allLabel: string;
}) {
  return (
    <SelectBox label={label} value={value} onChange={(v) => onChange(v as T | "")}>
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </SelectBox>
  );
}

/** The row of filters under a panel header. */
export function Filters({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3.5 pt-1 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}

const TONES = {
  success: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300",
  danger: "bg-rose-100 text-rose-500 dark:bg-rose-950/80 dark:text-rose-400",
  neutral: "bg-muted text-muted-foreground",
  brand: "bg-primary/10 text-primary",
} as const;

export type Tone = keyof typeof TONES;

/** The Figma's rounded status pill. */
export function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        TONES[tone]
      )}
    >
      {children}
    </span>
  );
}

/** Bold name over a small muted line, as every Figma table's first column. */
export function NameCell({
  name,
  sub,
  href,
}: {
  name: string;
  sub?: string | null;
  href?: string;
}) {
  return (
    <>
      {href ? (
        <Link href={href} className="font-bold hover:text-primary hover:underline">
          {name}
        </Link>
      ) : (
        <span className="font-bold">{name}</span>
      )}
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
    </>
  );
}

export const cellCls = "px-4 py-3 sm:px-6";

/**
 * The Figma's photo card: a dashed dropzone when empty, a round preview when
 * not.
 *
 * ponytail: the API stores a photo *URL* and rejects anything over 500 chars,
 * and POST /api/Files/upload is not wired yet — so a picked file previews
 * locally but only a pasted URL actually saves. The URL box stays visible for
 * that reason rather than being hidden behind the dropzone.
 */
export function PhotoCard({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = [value, onChange];

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return (
    <Panel className="h-fit">
      <div className="flex items-center justify-between">
        <SectionTitle>Photo</SectionTitle>
        <button
          type="button"
          onClick={() => onChange("")}
          disabled={!preview}
          className={cn(
            "flex items-center gap-1.5 text-xs font-bold transition-colors",
            preview
              ? "cursor-pointer text-rose-500 hover:text-rose-600"
              : "cursor-not-allowed text-muted-foreground"
          )}
        >
          <Trash2 className="size-4" />
          <span>Remove foto</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInput}
        onChange={handleFile}
        accept="image/*"
        className="hidden"
      />

      {preview ? (
        <div className="mx-auto size-44 overflow-hidden rounded-full border-4 border-muted shadow-md sm:size-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Avatar" className="size-full object-cover" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="flex w-full flex-col items-center justify-center space-y-2.5 rounded-2xl border-2 border-dashed border-primary/20 bg-muted/30 p-8 text-center transition-colors hover:bg-muted/60 sm:p-10"
        >
          <span className="mb-1 grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <FilePlus className="size-6 stroke-[1.8]" />
          </span>
          <span className="text-xs font-extrabold sm:text-sm">Select file</span>
          <span className="text-[11px] font-medium text-muted-foreground">
            Click or drag file to this area to upload
          </span>
        </button>
      )}

      <TextField
        label="Photo URL"
        value={preview.startsWith("blob:") ? "" : preview}
        onChange={onChange}
        maxLength={500}
      />
      {preview.startsWith("blob:") && (
        <p className="text-[11px] text-muted-foreground">
          Previewing a local file. The API stores a URL, so paste one above to save it.
        </p>
      )}
    </Panel>
  );
}

/**
 * Label stacked above its control, for forms built from the shadcn Input and
 * Select rather than the notched TextField — same typography as the notched
 * label so the two read as one system.
 */
export function LabeledField({
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
      <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
    </div>
  );
}

/** Pill group used wherever the Figma picks one value from a short list. */
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
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={option === value}
          className={cn(
            "rounded-xl border px-4 py-2 text-xs font-bold transition-colors",
            option === value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/** Save / Cancel pair at the foot of every form. */
export function FormActions({
  saveLabel,
  saving,
  onCancel,
}: {
  saveLabel: string;
  saving: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <PrimaryAction type="submit" disabled={saving}>
        {saving ? "SAVING…" : saveLabel}
      </PrimaryAction>
      <OutlineAction onClick={onCancel}>CANCEL</OutlineAction>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-xl bg-destructive/10 px-3 py-2 text-sm whitespace-pre-line text-destructive"
    >
      {message}
    </p>
  );
}

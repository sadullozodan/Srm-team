// The backend has no phone type: registration stores whatever digits it was
// given as the account's `userName`, and login compares it as a plain string.
// So "+992 900 40 66 80" and "992900406680" are different accounts to it, and
// a correct password on a prettily-typed number comes back as 401.
//
// Everything that sends a phone to the API sends it through here first, so the
// wire format is always the same 12 bare digits regardless of how it was typed.

const COUNTRY_CODE = "992";
const NATIONAL_LENGTH = 9; // 900406680

/**
 * Bare digits with the country code, e.g. "992900406680".
 *
 * Accepts the shapes people actually type: `+992 900 40 66 80`, `992900406680`,
 * `900406680`, `0900406680`, `00992900406680`. Anything it cannot place is
 * returned as digits only, so the API — not this function — rejects it.
 */
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");

  // 00992… — the international prefix written the old way.
  const trimmed = digits.startsWith("00") ? digits.slice(2) : digits;

  if (trimmed.startsWith(COUNTRY_CODE)) return trimmed;

  // 0900406680 — a national number with the trunk prefix still on it.
  const national = trimmed.startsWith("0") ? trimmed.slice(1) : trimmed;
  if (national.length === NATIONAL_LENGTH) return COUNTRY_CODE + national;

  return trimmed;
}

/** True once the number is long enough to be worth sending. */
export function isPlausiblePhone(input: string): boolean {
  return normalizePhone(input).length === COUNTRY_CODE.length + NATIONAL_LENGTH;
}

/** "992900406680" → "+992 90 040 66 80", for display only. */
export function formatPhone(input: string): string {
  const normalized = normalizePhone(input);
  if (!isPlausiblePhone(normalized)) return input;

  const national = normalized.slice(COUNTRY_CODE.length);
  const groups = [national.slice(0, 2), national.slice(2, 5), national.slice(5, 7), national.slice(7)];
  return `+${COUNTRY_CODE} ${groups.join(" ")}`;
}

// The phone is the account's userName, and the backend matches it literally.
// Every shape below was verified against the live API: only the bare digits
// authenticate — the rest returned 401 on a correct password.
//   npm run check
import assert from "node:assert/strict";
import { formatPhone, isPlausiblePhone, normalizePhone } from "./phone.ts";

const WIRE = "992900406680";

// The shapes people type, all of which must reach the same account.
assert.equal(normalizePhone("992900406680"), WIRE, "already bare");
assert.equal(normalizePhone("+992900406680"), WIRE, "leading plus");
assert.equal(normalizePhone("992 900 40 66 80"), WIRE, "spaced");
assert.equal(normalizePhone("+992 (90) 040-66-80"), WIRE, "punctuated");
assert.equal(normalizePhone("  992900406680  "), WIRE, "padded");
assert.equal(normalizePhone("00992900406680"), WIRE, "old international prefix");
assert.equal(normalizePhone("900406680"), WIRE, "national, no country code");
assert.equal(normalizePhone("0900406680"), WIRE, "national with trunk prefix");

// Nothing invented: an unplaceable number keeps its digits and the API judges it.
assert.equal(normalizePhone("12345"), "12345", "too short to place");
assert.equal(normalizePhone(""), "", "empty stays empty");

assert.equal(isPlausiblePhone("+992 900 40 66 80"), true, "full number");
assert.equal(isPlausiblePhone("900406"), false, "half a number");

assert.equal(formatPhone(WIRE), "+992 90 040 66 80", "display grouping");
assert.equal(formatPhone("nope"), "nope", "unformattable is left alone");

console.log("ok — phone normalisation");

/**
 * Validation rules for the public Application Request Form. The backend
 * (backend/src/data/application-requests.ts) enforces the same rules again —
 * this copy exists only to give inline feedback before the request is sent.
 */

export interface ApplicationFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  address1: string;
  address2: string;
  addressDetails: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  companyName: string;
  companyWebsite: string;
  directors: string;
  responsiblePerson: string;
  isAlreadyAccredited: string;
  dateOfEstablishment: string;
  licenseNumber: string;
  licenseFileName: string;
  applyFor: string[];
  remarks: string;
  isCaptchaChecked: boolean;
}

export type FormErrors = Partial<Record<keyof ApplicationFormValues | "licenseFile", string>>;

const NAME_RE = /^[\p{L}][\p{L} .'-]*$/u;
const PLACE_RE = /^[\p{L}0-9][\p{L}0-9 .,'()/-]*$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS_RE = /^[0-9\s\-()]+$/;
const ZIP_RE = /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/;
const LICENSE_RE = /^[A-Za-z0-9][A-Za-z0-9 /\-_.]*$/;

export const MAX_LICENSE_FILE_BYTES = 5 * 1024 * 1024;
export const LICENSE_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"];

/** Adds https:// when the user typed a bare domain, and returns null if it isn't a plausible website. */
export function normalizeWebsite(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    if (!/^https?:$/.test(url.protocol)) return null;
    if (!url.hostname.includes(".") || url.hostname.endsWith(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function required(v: string, label: string): string | null {
  return v.trim() ? null : `${label} is required.`;
}

function lengthBetween(v: string, min: number, max: number, label: string): string | null {
  const len = v.trim().length;
  if (len < min) return `${label} must be at least ${min} characters.`;
  if (len > max) return `${label} must be at most ${max} characters.`;
  return null;
}

export function validateField(name: keyof ApplicationFormValues, d: ApplicationFormValues): string | null {
  const v = (d[name] as string) ?? "";
  switch (name) {
    case "firstName":
    case "lastName": {
      const label = name === "firstName" ? "First name" : "Last name";
      return (
        required(v, label) ??
        lengthBetween(v, 2, 50, label) ??
        (NAME_RE.test(v.trim()) ? null : `${label} can only contain letters, spaces, . ' and -.`)
      );
    }
    case "email":
      return (
        required(v, "Email") ??
        (v.trim().length > 254 ? "Email is too long." : null) ??
        (EMAIL_RE.test(v.trim()) ? null : "Enter a valid email address, like name@company.com.")
      );
    case "phoneNumber": {
      const req = required(v, "Phone number");
      if (req) return req;
      if (!PHONE_CHARS_RE.test(v.trim())) return "Phone number can only contain digits, spaces, - and ( ).";
      const digits = v.replace(/\D/g, "");
      return digits.length < 6 || digits.length > 15 ? "Enter a phone number with 6 to 15 digits." : null;
    }
    case "address1":
      return required(v, "Address") ?? lengthBetween(v, 5, 200, "Address");
    case "address2":
    case "addressDetails":
      return v.trim().length > 200 ? "This is too long (200 characters max)." : null;
    case "city":
      return (
        required(v, "City") ??
        lengthBetween(v, 2, 80, "City") ??
        (PLACE_RE.test(v.trim()) ? null : "City contains characters that aren't allowed.")
      );
    case "state":
      return (
        required(v, "State") ??
        lengthBetween(v, 2, 80, "State") ??
        (PLACE_RE.test(v.trim()) ? null : "State contains characters that aren't allowed.")
      );
    case "zipCode":
      return required(v, "Zip code") ?? (ZIP_RE.test(v.trim()) ? null : "Enter a valid zip / postal code (3 to 10 letters or digits).");
    case "country":
      return required(v, "Country");
    case "companyName":
      return required(v, "Company name") ?? lengthBetween(v, 2, 120, "Company name");
    case "companyWebsite":
      return v.trim() && !normalizeWebsite(v) ? "Enter a valid website, like www.example.com." : null;
    case "directors":
    case "responsiblePerson":
      return v.trim().length > 100 ? "This is too long (100 characters max)." : null;
    case "dateOfEstablishment": {
      if (!v) return null;
      const date = new Date(v);
      if (Number.isNaN(date.getTime())) return "Enter a valid date.";
      if (date.getFullYear() < 1800) return "Enter a valid date of establishment.";
      if (date.getTime() > Date.now()) return "Date of establishment can't be in the future.";
      return null;
    }
    case "licenseNumber":
      return (
        required(v, "License / registration number") ??
        lengthBetween(v, 3, 50, "License / registration number") ??
        (LICENSE_RE.test(v.trim()) ? null : "Use only letters, digits, spaces and / - _ . in the number.")
      );
    case "applyFor":
      return d.applyFor.length === 0 ? "Select at least one option." : null;
    case "remarks":
      return v.trim().length > 1000 ? "Remarks are too long (1000 characters max)." : null;
    case "isCaptchaChecked":
      return d.isCaptchaChecked ? null : "Please confirm you're not a robot.";
    default:
      return null;
  }
}

/** Fields in on-screen order, so the first error found is the first one the user sees. */
export const FIELD_ORDER: (keyof ApplicationFormValues)[] = [
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "address1",
  "address2",
  "addressDetails",
  "city",
  "state",
  "zipCode",
  "country",
  "companyName",
  "companyWebsite",
  "directors",
  "responsiblePerson",
  "dateOfEstablishment",
  "licenseNumber",
  "applyFor",
  "remarks",
  "isCaptchaChecked",
];

export function validateAll(d: ApplicationFormValues): FormErrors {
  const errors: FormErrors = {};
  for (const name of FIELD_ORDER) {
    const message = validateField(name, d);
    if (message) errors[name] = message;
  }
  return errors;
}

export function validateLicenseFile(file: File): string | null {
  if (file.size > MAX_LICENSE_FILE_BYTES) return "File is too large (5 MB max).";
  if (file.type && !LICENSE_FILE_TYPES.includes(file.type)) return "Upload a PDF, Word document, JPG or PNG.";
  return null;
}

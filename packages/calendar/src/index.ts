import {
  isEthiopianLeapYear as isEthLeap,
  toEthiopian as toEth,
  toGregorian as toGreg,
} from "ethiopian-calendar-new";

export interface EthiopianDate {
  year: number;
  month: number;
  day: number;
}

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

export const ETHIOPIAN_MONTHS = [
  "መስከረም",
  "ጥቅምት",
  "ኅዳር",
  "ታኅሣሥ",
  "ጥር",
  "የካቲት",
  "መጋቢት",
  "ሚያዝያ",
  "ግንቦት",
  "ሰኔ",
  "ሐምሌ",
  "ነሐሴ",
  "ጳጉሜ",
] as const;

/**
 * Checks if a given Ethiopian year is a leap year (Pagume has 6 days instead of 5).
 */
export function isEthiopianLeapYear(year: number): boolean {
  return isEthLeap(year);
}

/**
 * Converts a Gregorian date (year, month 1-12, day 1-31) to an Ethiopian date.
 */
export function toEthiopianDate(gregorian: GregorianDate): EthiopianDate {
  const result = toEth(gregorian.year, gregorian.month, gregorian.day);
  return {
    year: result.year,
    month: result.month,
    day: result.day,
  };
}

/**
 * Converts an Ethiopian date to a Gregorian date.
 */
export function toGregorianDate(ethiopian: EthiopianDate): GregorianDate {
  const result = toGreg(ethiopian.year, ethiopian.month, ethiopian.day);
  return {
    year: result.year,
    month: result.month,
    day: result.day,
  };
}

/**
 * Formats an Ethiopian date into a human-readable Amharic string representation.
 */
export function formatEthiopianDate(date: EthiopianDate): string {
  const monthName = ETHIOPIAN_MONTHS[date.month - 1] ?? `ወር ${date.month}`;
  return `${monthName} ${date.day} ቀን ${date.year} ዓ.ም.`;
}

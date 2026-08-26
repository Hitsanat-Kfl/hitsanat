import { describe, it, expect } from "vitest";
import { toEthiopianDate, toGregorianDate, formatEthiopianDate } from "./index.js";

describe("Ethiopian Calendar Package", () => {
  it("should convert Gregorian date to Ethiopian date", () => {
    // 2024-09-11 is 2017-01-01 (Meskerem 1)
    const eth = toEthiopianDate({ year: 2024, month: 9, day: 11 });
    expect(eth.year).toBe(2017);
    expect(eth.month).toBe(1);
    expect(eth.day).toBe(1);
  });

  it("should convert Ethiopian date to Gregorian date", () => {
    const greg = toGregorianDate({ year: 2017, month: 1, day: 1 });
    expect(greg.year).toBe(2024);
    expect(greg.month).toBe(9);
    expect(greg.day).toBe(11);
  });

  it("should format Ethiopian date nicely in Amharic", () => {
    const formatted = formatEthiopianDate({ year: 2017, month: 1, day: 1 });
    expect(formatted).toBe("መስከረም 1 ቀን 2017 ዓ.ም.");
  });
});

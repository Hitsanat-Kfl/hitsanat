export class AcademicYear {
  private constructor(private readonly value: string) {}

  static create(year: string): AcademicYear {
    const pattern = /^\d{4}-\d{4}$/;
    if (!pattern.test(year)) {
      throw new Error("Academic year must be in format YYYY-YYYY (e.g., 2024-2025)");
    }
    return new AcademicYear(year);
  }

  toString(): string {
    return this.value;
  }

  equals(other: AcademicYear): boolean {
    return this.value === other.value;
  }

  getStartYear(): number {
    return Number.parseInt(this.value.split("-")[0], 10);
  }

  getEndYear(): number {
    return Number.parseInt(this.value.split("-")[1], 10);
  }
}

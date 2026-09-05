export class PhoneNumber {
  private constructor(private readonly value: string) {}

  static create(phone: string): PhoneNumber {
    const cleaned = phone.replace(/[\s\-()]/g, "");
    if (cleaned.length < 10 || cleaned.length > 20) {
      throw new Error("Phone number must be between 10 and 20 characters");
    }
    return new PhoneNumber(cleaned);
  }

  toString(): string {
    return this.value;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}

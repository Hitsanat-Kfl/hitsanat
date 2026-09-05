export class Weight {
  private constructor(private readonly value: number) {}

  static create(value: number): Weight {
    if (value < 0 || value > 1) {
      throw new Error("Weight must be between 0 and 1");
    }
    return new Weight(value);
  }

  static fromPercentage(percentage: number): Weight {
    return new Weight(percentage / 100);
  }

  toPercentage(): number {
    return this.value * 100;
  }

  toString(): string {
    return this.value.toFixed(4);
  }

  valueOf(): number {
    return this.value;
  }

  equals(other: Weight): boolean {
    return this.value === other.value;
  }
}

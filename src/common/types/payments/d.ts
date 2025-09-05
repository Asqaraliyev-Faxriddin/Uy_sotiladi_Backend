export function amountToPenny(amount: number): number {
    return Math.round(amount * 100);
  }
  
  export function pennyToAmount(penny: number): number {
    return penny / 100;
  }
  // src/common/helpers/date.ts (yoki siz joylashtirgan joyga yozing)

export function validateWithinMinutes(date: Date, minutes: number): boolean {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = diffMs / 1000 / 60;
    return diffMinutes <= minutes;
  }
  
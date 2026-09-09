import * as React from "react";
import { cn } from "../../lib/utils";

interface CalendarGridProps {
  currentDate: Date;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  locale?: "en" | "am";
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
}

const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_AM = ["እሑ", "ሰኞ", "ማክ", "ረቡ", "ሐሙ", "ዓር", "ቅዳ"];

const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[]
): boolean {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (disabledDates?.some((d) => isSameDay(d, date))) return true;
  return false;
}

function CalendarGrid({
  currentDate,
  selectedDate,
  onDateSelect,
  locale = "en",
  minDate,
  maxDate,
  disabledDates,
}: CalendarGridProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const weekdays = locale === "am" ? WEEKDAYS_AM : WEEKDAYS_EN;
  const today = new Date();

  const cells: React.ReactNode[] = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
    const isToday = isSameDay(date, today);
    const isDisabled = isDateDisabled(date, minDate, maxDate, disabledDates);

    cells.push(
      <button
        key={day}
        type="button"
        disabled={isDisabled}
        onClick={() => onDateSelect?.(date)}
        aria-label={`${month + 1}/${day}/${year}`}
        aria-selected={isSelected}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-30",
          isSelected &&
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          isToday && !isSelected && "font-bold text-primary",
          "min-h-[44px] min-w-[44px] md:min-h-[36px] md:min-w-[36px]"
        )}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div
            key={day}
            className="flex h-10 items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{cells}</div>
    </div>
  );
}

interface CalendarHeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  locale?: "en" | "am";
}

function CalendarHeader({ currentDate, onPrev, onNext, locale = "en" }: CalendarHeaderProps) {
  const month =
    locale === "am"
      ? [
          "ጃንዋሪ",
          "ፌብሩዋሪ",
          "ማርች",
          "ኤፕረል",
          "ሜይ",
          "ጁን",
          "ጁላይ",
          "ኦገስት",
          "ሴፕቴምበር",
          "ኦክቶበር",
          "ኖቬምበር",
          "ዲሴምበር",
        ][currentDate.getMonth()]
      : MONTHS_EN[currentDate.getMonth()];

  return (
    <div className="flex items-center justify-between py-2">
      <button
        type="button"
        onClick={onPrev}
        className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent min-h-[44px] md:min-h-[36px]"
        aria-label="Previous month"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <span className="text-sm font-medium">
        {month} {currentDate.getFullYear()}
      </span>
      <button
        type="button"
        onClick={onNext}
        className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent min-h-[44px] md:min-h-[36px]"
        aria-label="Next month"
      >
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

interface CalendarProps extends Omit<CalendarGridProps, "currentDate"> {
  defaultMonth?: Date;
}

function Calendar({
  defaultMonth,
  selectedDate,
  onDateSelect,
  locale = "en",
  minDate,
  maxDate,
  disabledDates,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(defaultMonth ?? new Date());

  const handlePrev = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="w-full min-w-[280px] max-w-sm p-3">
      <CalendarHeader
        currentDate={currentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        locale={locale}
      />
      <CalendarGrid
        currentDate={currentDate}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        locale={locale}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
      />
    </div>
  );
}

export { Calendar, CalendarGrid, CalendarHeader };

import { formatEthiopianDate, toEthiopianDate } from "@repo/calendar";
import { Badge } from "@repo/ui";

function EthiopianCrossPattern() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.08]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="ethiopian-cross"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 10 L30 50 M10 30 L50 30 M20 20 L40 40 M40 20 L20 40"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path d="M30 5 L33 10 L30 15 L27 10 Z" fill="currentColor" opacity="0.5" />
          <path d="M30 45 L33 50 L30 55 L27 50 Z" fill="currentColor" opacity="0.5" />
          <path d="M5 30 L10 33 L15 30 L10 27 Z" fill="currentColor" opacity="0.5" />
          <path d="M45 30 L50 33 L55 30 L50 27 Z" fill="currentColor" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ethiopian-cross)" />
    </svg>
  );
}

export function Hero() {
  const today = new Date();
  const ethDate = toEthiopianDate({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  });
  const formattedEthDate = formatEthiopianDate(ethDate);

  return (
    <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground sm:py-20">
      <EthiopianCrossPattern />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <Badge variant="secondary" className="mb-4">
          ህፃናት ክፍል
        </Badge>

        <h1 className="text-display">Hitsanat Kifl</h1>

        <p className="mt-2 text-body-large text-primary-foreground/80">Children&apos;s Ministry</p>

        <p className="mt-1 text-caption text-primary-foreground/60">ዛሬ {formattedEthDate}</p>

        <p className="mx-auto mt-4 max-w-2xl text-body text-primary-foreground/80">
          Nurturing spiritual growth and building community at Haramaya University Gibi Gubae
          through the Orthodox Tewahedo tradition.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#programs"
            className="inline-flex h-12 items-center justify-center rounded-md bg-background px-6 text-base font-medium text-foreground shadow-sm transition-colors hover:bg-background/90"
          >
            Explore Programs
          </a>
          <a
            href="#about"
            className="inline-flex h-12 items-center justify-center rounded-md border border-background/30 px-6 text-base font-medium text-background shadow-sm transition-colors hover:bg-background/10"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}

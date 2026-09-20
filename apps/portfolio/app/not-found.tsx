import Link from "next/link";
import { Header } from "../components/header";

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-primary">
        {/* Cross pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 10 L30 50 M10 30 L50 30 M20 20 L40 40 M40 20 L20 40' stroke='white' stroke-width='1.5' fill='none'/%3E%3Cpath d='M30 5 L33 10 L30 15 L27 10 Z' fill='white' opacity='0.5'/%3E%3Cpath d='M30 45 L33 50 L30 55 L27 50 Z' fill='white' opacity='0.5'/%3E%3Cpath d='M5 30 L10 33 L15 30 L10 27 Z' fill='white' opacity='0.5'/%3E%3Cpath d='M45 30 L50 33 L55 30 L50 27 Z' fill='white' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 px-4 text-center">
          <p className="mb-4 text-lg text-primary-foreground/80">የገጹ አልተገኘም</p>

          <h1 className="text-6xl font-bold tracking-tight text-white sm:text-8xl">404</h1>

          <p className="mt-4 text-xl text-primary-foreground/80">Page not found</p>

          <p className="mx-auto mt-4 max-w-md text-primary-foreground/60">
            The page you are looking for does not exist or has been moved.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-md bg-background px-6 text-base font-medium text-foreground shadow-sm transition-colors hover:bg-background/90"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

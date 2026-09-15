import { Card, CardContent } from "@repo/ui";
import { Header } from "../../../components/header";
import { Footer } from "../../../components/footer";
import { Users } from "lucide-react";

export default function KutitrPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/20">
            <Users className="h-6 w-6" />
          </div>
          <h1 className="text-display">Kutitr</h1>
          <p className="mt-2 text-body-large text-primary-foreground/80">ቁጥጥር</p>
          <p className="mx-auto mt-3 max-w-2xl text-body text-primary-foreground/70">
            Children's groups organized by age for pastoral care and mentorship.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-h2 text-foreground">About Kutitr</h2>
              <p className="mt-3 text-body text-muted-foreground">
                The Kutitr sub-department organizes children into age-based groups (Kutr 1 and
                Kutr 2) for pastoral care, mentorship, and attendance tracking. Each group has
                dedicated leaders who provide spiritual guidance and monitor children's progress.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-h2 text-foreground">Groups</h2>
              <ul className="mt-3 space-y-2 text-body text-muted-foreground">
                <li>• Kutr 1 — Younger children</li>
                <li>• Kutr 2 — Older children</li>
                <li>• Collection routes for Saturday attendance</li>
                <li>• Transport coordination</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}

import { Card, CardContent } from "@repo/ui";
import { Header } from "../../../components/header";
import { Footer } from "../../../components/footer";
import { GraduationCap } from "lucide-react";

export default function EkdPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-display">Ekd</h1>
          <p className="mt-2 text-body-large text-primary-foreground/80">እቅድ</p>
          <p className="mx-auto mt-3 max-w-2xl text-body text-primary-foreground/70">
            Biblical studies and scripture memorization programs.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-h2 text-foreground">About Ekd</h2>
              <p className="mt-3 text-body text-muted-foreground">
                The Ekd sub-department focuses on structured biblical studies and scripture
                memorization. We develop lesson plans, organize recitation competitions, and
                track children's progress in learning the Word of God.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-h2 text-foreground">Programs</h2>
              <ul className="mt-3 space-y-2 text-body text-muted-foreground">
                <li>• Structured Bible Study</li>
                <li>• Scripture Memorization</li>
                <li>• Recitation Competitions</li>
                <li>• Annual Plan Distribution</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}

import { Card, CardContent } from "@repo/ui";
import { Header } from "../../../components/header";
import { Footer } from "../../../components/footer";
import { Music } from "lucide-react";

export default function MezmurPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/20">
            <Music className="h-6 w-6" />
          </div>
          <h1 className="text-display">Mezmur</h1>
          <p className="mt-2 text-body-large text-primary-foreground/80">መዝሙር</p>
          <p className="mx-auto mt-3 max-w-2xl text-body text-primary-foreground/70">
            Choir and music ministry, preserving sacred hymns and praise.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-h2 text-foreground">About Mezmur</h2>
              <p className="mt-3 text-body text-muted-foreground">
                The Mezmur sub-department leads the music ministry of the children's group.
                We teach traditional Ethiopian Orthodox hymns (mezmur), organize choir
                performances, and prepare children for liturgical participation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-h2 text-foreground">Programs</h2>
              <ul className="mt-3 space-y-2 text-body text-muted-foreground">
                <li>• Choir Practice</li>
                <li>• Traditional Hymn Learning</li>
                <li>• Liturgical Music Preparation</li>
                <li>• Festival Performances</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}

import { Card, CardContent } from "@repo/ui";

export function About() {
  return (
    <section id="about" className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-h1 text-foreground">About Hitsanat Kifl</h2>
            <p className="mt-1 text-body-large text-muted-foreground">ስለ እኛ</p>

            <div className="mt-4 space-y-3 text-body text-muted-foreground">
              <p>
                Hitsanat Kifl is the children's ministry of the Orthodox Tewahedo Students'
                Association at Haramaya University Gibi Gubae. We are dedicated to nurturing
                spiritual growth and building community among children through traditional Orthodox
                education.
              </p>
              <p>
                Our ministry follows the rich traditions of the Ethiopian Orthodox Tewahedo Church,
                incorporating prayer, hymns, scripture study, and community service into our
                programs.
              </p>
              <p>
                We serve children from various backgrounds, providing them with a strong spiritual
                foundation while fostering a sense of belonging and community.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-h3 text-foreground">Our Mission</h3>
                <p className="mt-2 text-body text-muted-foreground">
                  To nurture spiritual growth and build community among children through Orthodox
                  Tewahedo education, preserving our sacred traditions while preparing the next
                  generation of faithful believers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="text-h3 text-foreground">Our Values</h3>
                <ul className="mt-2 space-y-2 text-body text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>Spiritual formation through prayer and scripture</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>Community building and fellowship</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>Preservation of Orthodox traditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>Service and love for neighbors</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

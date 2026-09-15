import { Card, CardContent } from "@repo/ui";
import { BookOpen, Music, Users, GraduationCap } from "lucide-react";

const programs = [
  {
    code: "timihrt",
    nameEn: "Timihrt",
    nameAm: "ትምህርት",
    description: "Spiritual education and biblical studies for children of all ages.",
    icon: BookOpen,
  },
  {
    code: "mezmur",
    nameEn: "Mezmur",
    nameAm: "መዝሙር",
    description: "Choir and music ministry, preserving sacred hymns and praise.",
    icon: Music,
  },
  {
    code: "kutitr",
    nameEn: "Kutitr",
    nameAm: "ቁጥጥር",
    description: "Children's groups organized by age for pastoral care and mentorship.",
    icon: Users,
  },
  {
    code: "ekd",
    nameEn: "Ekd",
    nameAm: "እቅድ",
    description: "Biblical studies and scripture memorization programs.",
    icon: GraduationCap,
  },
];

export function Programs() {
  return (
    <section id="programs" className="bg-surface-muted py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-h1 text-foreground">Our Programs</h2>
          <p className="mt-1 text-body-large text-muted-foreground">ክፍላት ሥራዎቻችን</p>
          <p className="mx-auto mt-3 max-w-2xl text-body text-muted-foreground">
            Four sub-departments working together to nurture spiritual growth in children.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program) => {
            const Icon = program.icon;
            return (
              <Card key={program.code} className="group transition-shadow hover:shadow-elevation-md">
                <CardContent className="p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-h4 text-foreground">{program.nameEn}</h3>
                  <p className="text-caption text-muted-foreground">{program.nameAm}</p>
                  <p className="mt-2 text-body-small text-muted-foreground">{program.description}</p>
                  <a
                    href={`/programs/${program.code}`}
                    className="mt-3 inline-block text-body-small font-medium text-primary hover:underline"
                  >
                    Learn more →
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

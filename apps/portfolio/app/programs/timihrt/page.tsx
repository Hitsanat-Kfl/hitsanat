import { Card, CardContent } from "@repo/ui";
import { Header } from "../../../components/header";
import { Footer } from "../../../components/footer";
import { BookOpen } from "lucide-react";

export default function TimihrtPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-foreground/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-display">Timihrt</h1>
          <p className="mt-2 text-body-large text-primary-foreground/80">ትምህርት</p>
          <p className="mx-auto mt-3 max-w-2xl text-body text-primary-foreground/70">
            Spiritual education and biblical studies for children of all ages.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-h2 text-foreground">About Timihrt</h2>
              <p className="mt-3 text-body text-muted-foreground">
                The Timihrt sub-department is responsible for the spiritual education of children
                in the ministry. We develop and deliver curriculum that covers biblical stories,
                Orthodox traditions, prayer practices, and moral teachings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-h2 text-foreground">Programs</h2>
              <ul className="mt-3 space-y-2 text-body text-muted-foreground">
                <li>• Sunday School Classes</li>
                <li>• Bible Study Groups</li>
                <li>• Prayer Sessions</li>
                <li>• Orthodox Tradition Workshops</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}

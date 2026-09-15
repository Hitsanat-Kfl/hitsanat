"use client";

import { useRouter } from "next/navigation";
import { EventForm } from "../../../../components/events/event-form";
import { PageShell } from "../../../../components/shell/page-shell";

export default function NewEventPage() {
  const router = useRouter();

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Events", href: "/events" },
        { label: "New Event" },
      ]}
      title="Create Event"
      description="Add a new ministry event."
    >
      <EventForm onSuccess={() => router.push("/events")} onCancel={() => router.push("/events")} />
    </PageShell>
  );
}

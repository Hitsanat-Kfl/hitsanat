"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  EmptyState,
  Select,
  Spinner,
} from "@repo/ui";
import { useState } from "react";
import { PageShell } from "@/features/shell";
import { useTransport } from "@/features/transport";

export default function TransportPage() {
  const { sessions, loading, error, refresh } = useTransport();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Transport" }]}
      title="Transport Dispatcher"
      description="Assign transport for members after attendance sessions."
      actions={
        <Button onClick={refresh} variant="outline" size="sm">
          Refresh
        </Button>
      }
    >
      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          title="No sessions found"
          description="No completed attendance sessions available for transport assignment."
        />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Select Session</h3>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedSessionId ?? ""}
                onChange={(e) => setSelectedSessionId(e.target.value || null)}
              >
                <option value="">Choose a session...</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {new Date(session.sessionDate).toLocaleDateString("en-ET")} —{" "}
                    {session.topic || session.sessionType}
                  </option>
                ))}
              </Select>
            </CardContent>
          </Card>

          {selectedSessionId && <TransportForm sessionId={selectedSessionId} />}
        </div>
      )}
    </PageShell>
  );
}

function TransportForm({ sessionId }: { sessionId: string }) {
  const { transportRecords, loading, error, assignTransport } = useTransport();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await assignTransport(sessionId, transportRecords);
    } catch {
      // error handled by hook
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold">Transport Assignment</h3>
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? "Saving..." : "Save Transport"}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>
        ) : (
          <p className="text-sm text-gray-500">
            Select a completed session to view and assign transport for members.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { Badge, Button, Card, CardContent, CardHeader, Checkbox } from "@repo/ui";
import { useState } from "react";
import { api } from "@/infrastructure/api/client";
import type { AttendanceRecord, AttendanceStatus } from "@/domains/definitions";

interface ChecksheetProps {
  records: AttendanceRecord[];
  sessionId: string;
  onSaved: () => void;
}

const statusColors: Record<AttendanceStatus, string> = {
  Present: "bg-green-100 text-green-800",
  Absent: "bg-red-100 text-red-800",
  Excused: "bg-yellow-100 text-yellow-800",
  Late: "bg-orange-100 text-orange-800",
};

export function Checksheet({ records, sessionId, onSaved }: ChecksheetProps) {
  const [localRecords, setLocalRecords] = useState(records);
  const [saving, setSaving] = useState(false);

  const updateStatus = (recordId: string, status: AttendanceStatus) => {
    setLocalRecords((prev) => prev.map((r) => (r.id === recordId ? { ...r, status } : r)));
  };

  const toggleTransport = (recordId: string) => {
    setLocalRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, transportAssigned: !r.transportAssigned } : r))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/attendance/sessions/${sessionId}/records`, {
        records: localRecords.map((r) => ({
          recordId: r.id,
          status: r.status,
          transportAssigned: r.transportAssigned,
        })),
      });
      onSaved();
    } catch (err) {
      console.error("Failed to save attendance:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold">Checksheet</h3>
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? "Saving..." : "Save Attendance"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Member</th>
                <th className="p-2 text-center">Present</th>
                <th className="p-2 text-center">Absent</th>
                <th className="p-2 text-center">Excused</th>
                <th className="p-2 text-center">Late</th>
                <th className="p-2 text-center">Transport</th>
              </tr>
            </thead>
            <tbody>
              {localRecords.map((record) => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{record.memberName}</td>
                  {(["Present", "Absent", "Excused", "Late"] as AttendanceStatus[]).map(
                    (status) => (
                      <td key={status} className="p-2 text-center">
                        <input
                          type="radio"
                          name={`status-${record.id}`}
                          checked={record.status === status}
                          onChange={() => updateStatus(record.id, status)}
                          className="h-4 w-4"
                        />
                      </td>
                    )
                  )}
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={record.transportAssigned}
                      onChange={() => toggleTransport(record.id)}
                      className="h-4 w-4"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

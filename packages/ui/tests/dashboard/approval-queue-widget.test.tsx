import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApprovalQueueWidget } from "../../src/components/ui/dashboard";
import type { ApprovalQueueItem } from "../../src/types/dashboard";

const mockItems: ApprovalQueueItem[] = [
  {
    id: "1",
    title: "New Member Registration",
    requester: "John Doe",
    date: "Sep 8, 2026",
    status: "pending",
    onApprove: vi.fn(),
    onReject: vi.fn(),
  },
  {
    id: "2",
    title: "Schedule Change Request",
    requester: "Jane Smith",
    date: "Sep 7, 2026",
    status: "completed",
  },
];

describe("ApprovalQueueWidget", () => {
  it("renders title", () => {
    render(<ApprovalQueueWidget items={mockItems} />);
    expect(screen.getByText("Approval Queue")).toBeDefined();
  });

  it("renders approval items", () => {
    render(<ApprovalQueueWidget items={mockItems} />);
    expect(screen.getByText("New Member Registration")).toBeDefined();
    expect(screen.getByText("John Doe")).toBeDefined();
  });

  it("renders approve/reject buttons for pending items", () => {
    render(<ApprovalQueueWidget items={mockItems} />);
    expect(screen.getByRole("button", { name: "Approve" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Reject" })).toBeDefined();
  });

  it("renders empty state", () => {
    render(<ApprovalQueueWidget items={[]} />);
    expect(screen.getByText("No pending approvals")).toBeDefined();
  });

  it("limits items to maxItems", () => {
    render(<ApprovalQueueWidget items={mockItems} maxItems={1} />);
    expect(screen.getByText("New Member Registration")).toBeDefined();
    expect(screen.queryByText("Schedule Change Request")).toBeNull();
  });
});

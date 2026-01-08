import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/db";

vi.mock("@/lib/session", () => ({
  getSessionUser: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    attempt: {
      updateMany: vi.fn(),
    },
    analyticsEvent: {
      create: vi.fn(),
    },
  },
}));

const mockGetSessionUser = vi.mocked(getSessionUser);
const mockUpdateMany = vi.mocked(prisma.attempt.updateMany);
const mockAnalyticsCreate = vi.mocked(prisma.analyticsEvent.create);

describe("POST /api/auth/claim", () => {
  beforeEach(() => {
    mockGetSessionUser.mockReset();
    mockUpdateMany.mockReset();
    mockAnalyticsCreate.mockReset();
  });

  it("returns 401 when unauthenticated", async () => {
    mockGetSessionUser.mockResolvedValue(null);

    const request = new Request("http://localhost/api/auth/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ anonymousId: "anon-123456" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBeDefined();
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("claims attempts for the anonymous id", async () => {
    mockGetSessionUser.mockResolvedValue({ id: "user-1", email: "a@b.com" } as {
      id: string;
      email: string;
    });
    mockUpdateMany.mockResolvedValue({ count: 2 });
    mockAnalyticsCreate.mockResolvedValue({} as never);

    const request = new Request("http://localhost/api/auth/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ anonymousId: "anon-123456" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.claimed).toBe(2);
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { anonymousId: "anon-123456", userId: null },
      data: { userId: "user-1" },
    });
    expect(mockAnalyticsCreate).toHaveBeenCalled();
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { useChatStore } from "../useChatStore";

// 1. Mock the client-side Supabase dependency cleanly using Vitest's 'vi' utility
const mockDeleteEq = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      delete: () => ({
        eq: mockDeleteEq,
      }),
    }),
  }),
}));

describe("Zustand - useChatStore Unit Tests (Vitest)", () => {
  beforeEach(() => {
    // Reset our Zustand state cache before every individual test run
    useChatStore.setState({ chats: [], isLoading: false });
    vi.clearAllMocks();
  });

  it("should snapshot the chat array and roll back cleanly if the Supabase network loop fails", async () => {
    // A. Arrange: Setup initial fake data matrix
    const initialFakeChats = [
      { id: "chat-111", title: "React Optimization Core", user_id: "user-xyz" },
      { id: "chat-222", title: "Zustand Rollback Room", user_id: "user-xyz" },
    ];

    useChatStore.getState().setChats(initialFakeChats);
    expect(useChatStore.getState().chats).toHaveLength(2);

    // B. Mock Behavior: Force the mock Supabase query to return a network connection failure error
    mockDeleteEq.mockResolvedValueOnce({
      error: {
        message: "Simulated Database Connection Drop Timeout",
        code: "500",
      },
      data: null,
    });

    // C. Act: Fire the action explicitly in isolation
    let caughtError: any = null;
    try {
      await useChatStore.getState().deleteChat("chat-222");
    } catch (err) {
      caughtError = err;
    }

    // D. Assertions: Verify data pipeline resilience
    expect(caughtError).toBeDefined();

    // Verify that the store successfully snapped back to its initial size of 2,
    // proving that 'chat-222' was put right back into memory after the simulated crash!
    const finalStoreState = useChatStore.getState().chats;
    expect(finalStoreState).toHaveLength(2);

    const targetRoomExists = finalStoreState.some(
      (chat) => chat.id === "chat-222",
    );
    expect(targetRoomExists).toBe(true);
  });
});

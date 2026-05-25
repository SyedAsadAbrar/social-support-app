import {beforeEach, describe, expect, it, vi} from "vitest";

vi.mock("@/lib/env", () => ({
  getOpenAIConfig: vi.fn()
}));

vi.mock("@/lib/openai", () => {
  class OpenAISuggestionError extends Error {
    reason: string;

    constructor(reason: string) {
      super(reason);
      this.reason = reason;
    }
  }

  return {
    generateWritingSuggestion: vi.fn(),
    OpenAISuggestionError
  };
});

import {POST} from "./route";
import {getOpenAIConfig} from "@/lib/env";
import {generateWritingSuggestion, OpenAISuggestionError} from "@/lib/openai";

const mockedGetOpenAIConfig = vi.mocked(getOpenAIConfig);
const mockedGenerateWritingSuggestion = vi.mocked(generateWritingSuggestion);

const validPayload = {
  field: "financialSituation",
  locale: "en",
  draft: {
    maritalStatus: "single",
    dependents: 2,
    employmentStatus: "unemployed",
    monthlyIncome: 0,
    housingStatus: "rent"
  },
  currentText: "I need help describing my financial situation."
};

function jsonRequest(payload: unknown) {
  return new Request("http://localhost/api/ai/suggest", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

describe("POST /api/ai/suggest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns generated suggestions for valid payloads", async () => {
    mockedGetOpenAIConfig.mockReturnValue({
      ok: true,
      apiKey: "test-key",
      model: "gpt-4o-mini"
    });
    mockedGenerateWritingSuggestion.mockResolvedValue("Professional draft text.");

    const response = await POST(jsonRequest(validPayload));
    const body = (await response.json()) as {suggestion: string};

    expect(response.status).toBe(200);
    expect(body.suggestion).toBe("Professional draft text.");
    expect(mockedGenerateWritingSuggestion).toHaveBeenCalledWith(
      expect.objectContaining({
        field: "financialSituation",
        apiKey: "test-key",
        model: "gpt-4o-mini"
      })
    );
  });

  it("rejects sensitive unexpected draft fields", async () => {
    const response = await POST(
      jsonRequest({
        ...validPayload,
        draft: {
          ...validPayload.draft,
          nationalId: "AB-12345"
        }
      })
    );
    const body = (await response.json()) as {error: string};

    expect(response.status).toBe(400);
    expect(body.error).toBe("invalidPayload");
    expect(mockedGenerateWritingSuggestion).not.toHaveBeenCalled();
  });

  it("returns 503 when OpenAI is not configured", async () => {
    mockedGetOpenAIConfig.mockReturnValue({
      ok: false,
      error: "missingApiKey"
    });

    const response = await POST(jsonRequest(validPayload));
    const body = (await response.json()) as {error: string};

    expect(response.status).toBe(503);
    expect(body.error).toBe("missingApiKey");
  });

  it("returns 504 on OpenAI timeout", async () => {
    mockedGetOpenAIConfig.mockReturnValue({
      ok: true,
      apiKey: "test-key",
      model: "gpt-4o-mini"
    });
    mockedGenerateWritingSuggestion.mockRejectedValue(
      new OpenAISuggestionError("timeout")
    );

    const response = await POST(jsonRequest(validPayload));
    const body = (await response.json()) as {error: string};

    expect(response.status).toBe(504);
    expect(body.error).toBe("timeout");
  });
});

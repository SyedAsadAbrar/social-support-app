const defaultOpenAIModel = "gpt-4o-mini";
const placeholderApiKeys = new Set([
  "replace_with_your_openai_api_key",
  "your_api_key_here"
]);

export type OpenAIConfig =
  | {
      ok: true;
      apiKey: string;
      model: string;
    }
  | {
      ok: false;
      error: "missingApiKey";
    };

export function getOpenAIConfig(): OpenAIConfig {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey || placeholderApiKeys.has(apiKey)) {
    return {
      ok: false,
      error: "missingApiKey"
    };
  }

  return {
    ok: true,
    apiKey,
    model: process.env.OPENAI_MODEL?.trim() || defaultOpenAIModel
  };
}

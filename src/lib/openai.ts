import type {
  EmploymentStatus,
  HousingStatus,
  MaritalStatus,
  SituationField
} from "@/features/application-wizard/types";
import type {Locale} from "@/i18n/config";

const chatCompletionsEndpoint = "https://api.openai.com/v1/chat/completions";
const requestTimeoutMs = 12_000;

export type AiSuggestionDraft = {
  maritalStatus?: MaritalStatus | "";
  dependents?: number | "";
  employmentStatus?: EmploymentStatus | "";
  monthlyIncome?: number | "";
  housingStatus?: HousingStatus | "";
};

export type AiSuggestionInput = {
  apiKey: string;
  model: string;
  field: SituationField;
  locale: Locale;
  draft: AiSuggestionDraft;
  currentText?: string;
};

export class OpenAISuggestionError extends Error {
  constructor(
    public readonly reason: "timeout" | "upstream" | "invalidResponse",
    message: string
  ) {
    super(message);
    this.name = "OpenAISuggestionError";
  }
}

const fieldLabels: Record<Locale, Record<SituationField, string>> = {
  en: {
    financialSituation: "Current Financial Situation",
    employmentCircumstances: "Employment Circumstances",
    reasonForApplying: "Reason for Applying"
  },
  ar: {
    financialSituation: "الوضع المالي الحالي",
    employmentCircumstances: "ظروف العمل",
    reasonForApplying: "سبب التقديم"
  }
};

function systemPrompt(locale: Locale) {
  if (locale === "ar") {
    return [
      "أنت مساعد كتابة لبوابة دعم اجتماعي حكومية.",
      "اكتب نصًا واضحًا ومحترمًا ومباشرًا باللغة العربية.",
      "لا تخترع تفاصيل شخصية أو طبية أو قانونية.",
      "لا تطلب أو تذكر أرقام الهوية أو الهاتف أو البريد أو العنوان.",
      "أعد النص المقترح فقط دون عنوان أو نقاط."
    ].join(" ");
  }

  return [
    "You are a writing assistant for a government social support application.",
    "Write clear, respectful, plain-language text in English.",
    "Do not invent personal, medical, or legal details.",
    "Do not ask for or include National ID, phone, email, or address.",
    "Return only the suggested text with no heading or bullet points."
  ].join(" ");
}

function userPrompt(input: AiSuggestionInput) {
  return JSON.stringify(
    {
      targetField: fieldLabels[input.locale][input.field],
      nonSensitiveDraftContext: input.draft,
      currentText: input.currentText || "",
      instruction:
        input.locale === "ar"
          ? "اكتب فقرة واحدة من 80 إلى 120 كلمة يمكن لمقدم الطلب تعديلها قبل الإرسال."
          : "Write one paragraph of 80 to 120 words that the applicant can edit before submitting."
    },
    null,
    2
  );
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function extractSuggestion(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const choices = (payload as {choices?: unknown}).choices;
  if (!Array.isArray(choices)) {
    return "";
  }

  const firstChoice = choices[0] as {message?: {content?: unknown}} | undefined;
  return typeof firstChoice?.message?.content === "string"
    ? firstChoice.message.content.trim()
    : "";
}

export async function generateWritingSuggestion(input: AiSuggestionInput) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(chatCompletionsEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: input.model,
        messages: [
          {
            role: "system",
            content: systemPrompt(input.locale)
          },
          {
            role: "user",
            content: userPrompt(input)
          }
        ],
        temperature: 0.4,
        max_tokens: 260
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new OpenAISuggestionError(
        "upstream",
        `OpenAI request failed with status ${response.status}`
      );
    }

    const payload = (await response.json()) as unknown;
    const suggestion = extractSuggestion(payload);

    if (!suggestion) {
      throw new OpenAISuggestionError(
        "invalidResponse",
        "OpenAI response did not contain a suggestion"
      );
    }

    return suggestion;
  } catch (error) {
    if (error instanceof OpenAISuggestionError) {
      throw error;
    }

    if (isAbortError(error)) {
      throw new OpenAISuggestionError("timeout", "OpenAI request timed out");
    }

    throw new OpenAISuggestionError("upstream", "OpenAI request failed");
  } finally {
    clearTimeout(timeout);
  }
}

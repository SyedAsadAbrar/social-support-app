import {NextResponse} from "next/server";
import {z} from "zod";
import {getOpenAIConfig} from "@/lib/env";
import {generateWritingSuggestion, OpenAISuggestionError} from "@/lib/openai";

const aiSuggestionRequestSchema = z.object({
  field: z.enum(["financialSituation", "employmentCircumstances", "reasonForApplying"]),
  locale: z.enum(["en", "ar"]),
  draft: z
    .object({
      maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).or(z.literal("")).optional(),
      dependents: z.number().min(0).max(30).or(z.literal("")).optional(),
      employmentStatus: z
        .enum(["employed", "unemployed", "selfEmployed", "student", "retired", "unableToWork"])
        .or(z.literal(""))
        .optional(),
      monthlyIncome: z.number().min(0).max(1000000).or(z.literal("")).optional(),
      housingStatus: z.enum(["own", "rent", "withFamily", "temporary", "homeless"]).or(z.literal("")).optional()
    })
    .strict(),
  currentText: z.string().trim().max(1200).optional()
});

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {error: "invalidJson"},
      {status: 400}
    );
  }

  const result = aiSuggestionRequestSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "invalidPayload",
        fields: result.error.flatten().fieldErrors
      },
      {status: 400}
    );
  }

  const config = getOpenAIConfig();

  if (!config.ok) {
    return NextResponse.json(
      {error: config.error},
      {status: 503}
    );
  }

  try {
    const suggestion = await generateWritingSuggestion({
      ...result.data,
      apiKey: config.apiKey,
      model: config.model
    });

    return NextResponse.json({suggestion});
  } catch (error) {
    if (error instanceof OpenAISuggestionError && error.reason === "timeout") {
      return NextResponse.json(
        {error: "timeout"},
        {status: 504}
      );
    }

    return NextResponse.json(
      {error: "suggestionFailed"},
      {status: 502}
    );
  }
}

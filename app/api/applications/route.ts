import {NextResponse} from "next/server";
import {applicationSchema} from "@/features/application-wizard/schema";

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

  const result = applicationSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "invalidPayload",
        fields: result.error.flatten().fieldErrors
      },
      {status: 400}
    );
  }

  return NextResponse.json(
    {
      applicationId: `SSA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      submittedAt: new Date().toISOString()
    },
    {status: 201}
  );
}

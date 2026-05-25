import {describe, expect, it} from "vitest";
import {POST} from "./route";
import type {ApplicationForm} from "@/features/application-wizard/types";

const validApplication: ApplicationForm = {
  name: "Amina Hassan",
  nationalId: "AB-12345",
  dateOfBirth: "1990-01-01",
  gender: "female",
  address: "12 Civic Street",
  city: "Amman",
  state: "Capital",
  country: "Jordan",
  phone: "+962 7 1234 5678",
  email: "amina@example.com",
  maritalStatus: "single",
  dependents: 2,
  employmentStatus: "unemployed",
  monthlyIncome: 0,
  housingStatus: "rent",
  financialSituation:
    "I currently have no stable income and cannot cover essential household expenses.",
  employmentCircumstances:
    "My previous contract ended recently and I am actively looking for suitable work.",
  reasonForApplying:
    "I am applying for temporary assistance to cover rent, food, and urgent bills."
};

function jsonRequest(payload: unknown) {
  return new Request("http://localhost/api/applications", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

describe("POST /api/applications", () => {
  it("returns a mock application id for valid payloads", async () => {
    const response = await POST(jsonRequest(validApplication));
    const body = (await response.json()) as {
      applicationId: string;
      submittedAt: string;
    };

    expect(response.status).toBe(201);
    expect(body.applicationId).toMatch(/^SSA-[A-Z0-9]{8}$/);
    expect(new Date(body.submittedAt).toString()).not.toBe("Invalid Date");
  });

  it("rejects invalid payloads", async () => {
    const response = await POST(
      jsonRequest({
        ...validApplication,
        email: "not-an-email"
      })
    );
    const body = (await response.json()) as {error: string};

    expect(response.status).toBe(400);
    expect(body.error).toBe("invalidPayload");
  });
});

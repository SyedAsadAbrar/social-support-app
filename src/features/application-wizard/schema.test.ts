import {describe, expect, it} from "vitest";
import {
  applicationSchema,
  familyFinancialSchema,
  personalInfoSchema,
  situationDescriptionsSchema
} from "./schema";
import type {ApplicationForm} from "./types";

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

describe("application validation schemas", () => {
  it("accepts a valid complete application", () => {
    expect(applicationSchema.safeParse(validApplication).success).toBe(true);
  });

  it("rejects today or future dates of birth", () => {
    const today = new Date().toISOString().slice(0, 10);

    expect(
      applicationSchema.safeParse({
        ...validApplication,
        dateOfBirth: today
      }).success
    ).toBe(false);
  });

  it("keeps each step schema scoped to that step", () => {
    expect(
      personalInfoSchema.safeParse({
        name: validApplication.name,
        nationalId: validApplication.nationalId,
        dateOfBirth: validApplication.dateOfBirth,
        gender: validApplication.gender,
        address: validApplication.address,
        city: validApplication.city,
        state: validApplication.state,
        country: validApplication.country,
        phone: validApplication.phone,
        email: validApplication.email
      }).success
    ).toBe(true);

    expect(
      familyFinancialSchema.safeParse({
        maritalStatus: validApplication.maritalStatus,
        dependents: validApplication.dependents,
        employmentStatus: validApplication.employmentStatus,
        monthlyIncome: validApplication.monthlyIncome,
        housingStatus: validApplication.housingStatus
      }).success
    ).toBe(true);

    expect(
      situationDescriptionsSchema.safeParse({
        financialSituation: validApplication.financialSituation,
        employmentCircumstances: validApplication.employmentCircumstances,
        reasonForApplying: validApplication.reasonForApplying
      }).success
    ).toBe(true);
  });

  it("rejects short situation descriptions", () => {
    expect(
      situationDescriptionsSchema.safeParse({
        financialSituation: "Too short",
        employmentCircumstances: validApplication.employmentCircumstances,
        reasonForApplying: validApplication.reasonForApplying
      }).success
    ).toBe(false);
  });
});

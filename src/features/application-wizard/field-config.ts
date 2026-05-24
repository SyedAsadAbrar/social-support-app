import type {ApplicationForm, SituationField} from "./types";

export type ApplicationFieldName = keyof ApplicationForm;

export const personalFields = [
  "name",
  "nationalId",
  "dateOfBirth",
  "gender",
  "address",
  "city",
  "state",
  "country",
  "phone",
  "email"
] satisfies ApplicationFieldName[];

export const familyFinancialFields = [
  "maritalStatus",
  "dependents",
  "employmentStatus",
  "monthlyIncome",
  "housingStatus"
] satisfies ApplicationFieldName[];

export const situationFields = [
  "financialSituation",
  "employmentCircumstances",
  "reasonForApplying"
] satisfies SituationField[];

export const stepFields = [
  personalFields,
  familyFinancialFields,
  situationFields
] as const;

export const stepTranslationKeys = [
  "personal",
  "family",
  "situation"
] as const;

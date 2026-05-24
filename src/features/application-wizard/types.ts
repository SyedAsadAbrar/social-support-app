export type Gender = "male" | "female" | "preferNotToSay";

export type MaritalStatus = "single" | "married" | "divorced" | "widowed";

export type EmploymentStatus =
  | "employed"
  | "unemployed"
  | "selfEmployed"
  | "student"
  | "retired"
  | "unableToWork";

export type HousingStatus =
  | "own"
  | "rent"
  | "withFamily"
  | "temporary"
  | "homeless";

export type SituationField =
  | "financialSituation"
  | "employmentCircumstances"
  | "reasonForApplying";

export type ApplicationForm = {
  name: string;
  nationalId: string;
  dateOfBirth: string;
  gender: Gender | "";
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  maritalStatus: MaritalStatus | "";
  dependents: number | "";
  employmentStatus: EmploymentStatus | "";
  monthlyIncome: number | "";
  housingStatus: HousingStatus | "";
  financialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
};

export type ApplicationFormDraft = ApplicationForm;

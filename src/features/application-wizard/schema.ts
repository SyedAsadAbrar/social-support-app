import {z} from "zod";

const requiredText = (max = 160) =>
  z
    .string({required_error: "required"})
    .trim()
    .min(1, "required")
    .max(max, "tooLong");

const requiredNumber = (max: number, maxMessage: string) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }

      return Number(value);
    },
    z
      .number({required_error: "required", invalid_type_error: "invalidNumber"})
      .min(0, "invalidNumber")
      .max(max, maxMessage)
  );

const requiredEnum = <T extends [string, ...string[]]>(values: T) =>
  z.preprocess(
    (value) => value === "" ? undefined : value,
    z.enum(values, {
      errorMap: () => ({message: "required"})
    })
  );

const situationText = z
  .string({required_error: "required"})
  .trim()
  .min(30, "descriptionTooShort")
  .max(1200, "descriptionTooLong");

function yesterdayDateString() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

export const applicationSchema = z.object({
  name: requiredText(120),
  nationalId: requiredText(40).regex(/^[A-Za-z0-9-]{5,40}$/, "invalidNationalId"),
  dateOfBirth: requiredText(20).refine((value) => {
    return value <= yesterdayDateString();
  }, "invalidDate"),
  gender: requiredEnum(["male", "female", "preferNotToSay"]),
  address: requiredText(240),
  city: requiredText(100),
  state: requiredText(100),
  country: requiredText(100),
  phone: requiredText(40).regex(/^[+()\-\s0-9]{7,24}$/, "invalidPhone"),
  email: requiredText(160).email("invalidEmail"),
  maritalStatus: requiredEnum(["single", "married", "divorced", "widowed"]),
  dependents: requiredNumber(30, "dependentsRange"),
  employmentStatus: requiredEnum([
    "employed",
    "unemployed",
    "selfEmployed",
    "student",
    "retired",
    "unableToWork"
  ]),
  monthlyIncome: requiredNumber(1000000, "incomeRange"),
  housingStatus: requiredEnum(["own", "rent", "withFamily", "temporary", "homeless"]),
  financialSituation: situationText,
  employmentCircumstances: situationText,
  reasonForApplying: situationText
});

export const personalInfoSchema = applicationSchema.pick({
  name: true,
  nationalId: true,
  dateOfBirth: true,
  gender: true,
  address: true,
  city: true,
  state: true,
  country: true,
  phone: true,
  email: true
});

export const familyFinancialSchema = applicationSchema.pick({
  maritalStatus: true,
  dependents: true,
  employmentStatus: true,
  monthlyIncome: true,
  housingStatus: true
});

export const situationDescriptionsSchema = applicationSchema.pick({
  financialSituation: true,
  employmentCircumstances: true,
  reasonForApplying: true
});

export type ValidApplicationForm = z.output<typeof applicationSchema>;

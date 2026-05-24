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

const situationText = z
  .string({required_error: "required"})
  .trim()
  .min(30, "descriptionTooShort")
  .max(1200, "descriptionTooLong");

export const applicationSchema = z.object({
  name: requiredText(120),
  nationalId: requiredText(40).regex(/^[A-Za-z0-9-]{5,40}$/, "invalidNationalId"),
  dateOfBirth: requiredText(20).refine((value) => {
    const date = new Date(value);
    return Number.isFinite(date.getTime()) && date < new Date();
  }, "invalidDate"),
  gender: z.enum(["male", "female", "nonBinary", "preferNotToSay"], {
    required_error: "required",
    invalid_type_error: "required"
  }),
  address: requiredText(240),
  city: requiredText(100),
  state: requiredText(100),
  country: requiredText(100),
  phone: requiredText(40).regex(/^[+()\-\s0-9]{7,24}$/, "invalidPhone"),
  email: requiredText(160).email("invalidEmail"),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"], {
    required_error: "required",
    invalid_type_error: "required"
  }),
  dependents: requiredNumber(30, "dependentsRange"),
  employmentStatus: z.enum(
    ["employed", "unemployed", "selfEmployed", "student", "retired", "unableToWork"],
    {
      required_error: "required",
      invalid_type_error: "required"
    }
  ),
  monthlyIncome: requiredNumber(1000000, "incomeRange"),
  housingStatus: z.enum(["own", "rent", "withFamily", "temporary", "homeless"], {
    required_error: "required",
    invalid_type_error: "required"
  }),
  financialSituation: situationText,
  employmentCircumstances: situationText,
  reasonForApplying: situationText
});

export type ValidApplicationForm = z.output<typeof applicationSchema>;

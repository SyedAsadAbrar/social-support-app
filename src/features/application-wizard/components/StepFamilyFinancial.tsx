"use client";

import {useTranslations} from "next-intl";
import {
  employmentStatusOptions,
  housingStatusOptions,
  maritalStatusOptions
} from "../field-config";
import {SelectField, TextField} from "./FormControls";

type StepProps = {
  errorText: (key: string) => string;
};

export function StepFamilyFinancial({errorText}: StepProps) {
  const t = useTranslations("form");

  return (
    <fieldset className="grid gap-5 md:grid-cols-2">
      <legend className="sr-only">{t("steps.family")}</legend>
      <SelectField
        name="maritalStatus"
        label={t("fields.maritalStatus")}
        placeholder={t("common.select")}
        options={maritalStatusOptions}
        optionLabel={(value) => t(`options.maritalStatus.${value}`)}
        errorText={errorText}
      />
      <TextField
        name="dependents"
        label={t("fields.dependents")}
        type="number"
        inputMode="numeric"
        helper={t("helpers.dependents")}
        errorText={errorText}
      />
      <SelectField
        name="employmentStatus"
        label={t("fields.employmentStatus")}
        placeholder={t("common.select")}
        options={employmentStatusOptions}
        optionLabel={(value) => t(`options.employmentStatus.${value}`)}
        errorText={errorText}
      />
      <TextField
        name="monthlyIncome"
        label={t("fields.monthlyIncome")}
        type="number"
        inputMode="decimal"
        helper={t("helpers.monthlyIncome")}
        errorText={errorText}
      />
      <SelectField
        name="housingStatus"
        label={t("fields.housingStatus")}
        placeholder={t("common.select")}
        options={housingStatusOptions}
        optionLabel={(value) => t(`options.housingStatus.${value}`)}
        errorText={errorText}
      />
    </fieldset>
  );
}

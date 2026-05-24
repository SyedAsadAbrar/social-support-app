"use client";

import {useTranslations} from "next-intl";
import {genderOptions} from "../field-config";
import {SelectField, TextField} from "./FormControls";

type StepProps = {
  errorText: (key: string) => string;
};

export function StepPersonalInfo({errorText}: StepProps) {
  const t = useTranslations("form");
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const maxDateOfBirth = yesterday.toISOString().slice(0, 10);

  return (
    <fieldset className="grid gap-5 md:grid-cols-2">
      <legend className="sr-only">{t("steps.personal")}</legend>
      <TextField
        name="name"
        label={t("fields.name")}
        autoComplete="name"
        errorText={errorText}
      />
      <TextField
        name="nationalId"
        label={t("fields.nationalId")}
        helper={t("helpers.nationalId")}
        errorText={errorText}
      />
      <TextField
        name="dateOfBirth"
        label={t("fields.dateOfBirth")}
        type="date"
        max={maxDateOfBirth}
        errorText={errorText}
      />
      <SelectField
        name="gender"
        label={t("fields.gender")}
        placeholder={t("common.select")}
        options={genderOptions}
        optionLabel={(value) => t(`options.gender.${value}`)}
        errorText={errorText}
      />
      <div className="md:col-span-2">
        <TextField
          name="address"
          label={t("fields.address")}
          autoComplete="street-address"
          errorText={errorText}
        />
      </div>
      <TextField
        name="city"
        label={t("fields.city")}
        autoComplete="address-level2"
        errorText={errorText}
      />
      <TextField
        name="state"
        label={t("fields.state")}
        autoComplete="address-level1"
        errorText={errorText}
      />
      <TextField
        name="country"
        label={t("fields.country")}
        autoComplete="country-name"
        errorText={errorText}
      />
      <TextField
        name="phone"
        label={t("fields.phone")}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        errorText={errorText}
      />
      <TextField
        name="email"
        label={t("fields.email")}
        type="email"
        inputMode="email"
        autoComplete="email"
        errorText={errorText}
      />
    </fieldset>
  );
}

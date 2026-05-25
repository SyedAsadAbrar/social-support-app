"use client";

import {useTranslations} from "next-intl";
import type {Locale} from "@/i18n/config";
import {genderOptions} from "../field-config";
import {SelectField, TextField} from "./FormControls";

type StepProps = {
  locale: Locale;
  showValidation: boolean;
  errorText: (key: string) => string;
};

export function StepPersonalInfo({locale, showValidation, errorText}: StepProps) {
  const t = useTranslations("form");
  const dir = locale === "ar" ? "rtl" : "ltr";
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
        showError={showValidation}
        errorText={errorText}
      />
      <TextField
        name="nationalId"
        label={t("fields.nationalId")}
        helper={t("helpers.nationalId")}
        showError={showValidation}
        errorText={errorText}
      />
      <TextField
        name="dateOfBirth"
        label={t("fields.dateOfBirth")}
        type="date"
        lang={locale}
        dir={dir}
        max={maxDateOfBirth}
        showError={showValidation}
        errorText={errorText}
      />
      <SelectField
        name="gender"
        label={t("fields.gender")}
        placeholder={t("common.select")}
        options={genderOptions}
        optionLabel={(value) => t(`options.gender.${value}`)}
        showError={showValidation}
        errorText={errorText}
      />
      <div className="md:col-span-2">
        <TextField
          name="address"
          label={t("fields.address")}
          autoComplete="street-address"
          showError={showValidation}
          errorText={errorText}
        />
      </div>
      <TextField
        name="city"
        label={t("fields.city")}
        autoComplete="address-level2"
        showError={showValidation}
        errorText={errorText}
      />
      <TextField
        name="state"
        label={t("fields.state")}
        autoComplete="address-level1"
        showError={showValidation}
        errorText={errorText}
      />
      <TextField
        name="country"
        label={t("fields.country")}
        autoComplete="country-name"
        showError={showValidation}
        errorText={errorText}
      />
      <TextField
        name="phone"
        label={t("fields.phone")}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        showError={showValidation}
        errorText={errorText}
      />
      <TextField
        name="email"
        label={t("fields.email")}
        type="email"
        inputMode="email"
        autoComplete="email"
        showError={showValidation}
        errorText={errorText}
      />
    </fieldset>
  );
}

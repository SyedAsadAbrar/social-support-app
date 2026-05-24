"use client";

import {useTranslations} from "next-intl";
import {situationFields} from "../field-config";
import {TextAreaField} from "./FormControls";

type StepProps = {
  errorText: (key: string) => string;
};

export function StepSituationDescriptions({errorText}: StepProps) {
  const t = useTranslations("form");

  return (
    <fieldset className="grid gap-6">
      <legend className="sr-only">{t("steps.situation")}</legend>
      {situationFields.map((field) => (
        <TextAreaField
          key={field}
          name={field}
          label={t(`fields.${field}`)}
          helper={t(`helpers.${field}`)}
          rows={5}
          errorText={errorText}
        />
      ))}
    </fieldset>
  );
}

"use client";

import {WandSparkles} from "lucide-react";
import {useTranslations} from "next-intl";
import {useEffect, useRef, useState} from "react";
import {useFormContext} from "react-hook-form";
import type {Locale} from "@/i18n/config";
import {situationFields} from "../field-config";
import type {ApplicationForm, SituationField} from "../types";
import {AiSuggestionDialog} from "./AiSuggestionDialog";
import {TextAreaField} from "./FormControls";

type StepProps = {
  locale: Locale;
  errorText: (key: string) => string;
};

type SuggestionResponse = {
  suggestion: string;
};

function isSuggestionResponse(value: unknown): value is SuggestionResponse {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof (value as Partial<SuggestionResponse>).suggestion === "string"
  );
}

export function StepSituationDescriptions({locale, errorText}: StepProps) {
  const t = useTranslations("form");
  const {getValues, setValue} = useFormContext<ApplicationForm>();
  const [activeField, setActiveField] = useState<SituationField | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const requestControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => requestControllerRef.current?.abort();
  }, []);

  async function requestSuggestion(field: SituationField, currentTextOverride?: string) {
    const values = getValues();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    requestControllerRef.current?.abort();
    requestControllerRef.current = controller;
    setActiveField(field);
    setSuggestion("");
    setErrorMessage(null);
    setIsEditing(false);
    setStatus("loading");

    try {
      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          field,
          locale,
          draft: {
            maritalStatus: values.maritalStatus,
            dependents: values.dependents,
            employmentStatus: values.employmentStatus,
            monthlyIncome: values.monthlyIncome,
            housingStatus: values.housingStatus
          },
          currentText: currentTextOverride ?? values[field]
        }),
        signal: controller.signal
      });
      const payload = (await response.json()) as unknown;

      if (!response.ok || !isSuggestionResponse(payload)) {
        const message =
          response.status === 503
            ? t("ai.errors.missingKey")
            : response.status === 504
              ? t("ai.errors.timeout")
              : t("ai.errors.failed");

        throw new Error(message);
      }

      if (requestControllerRef.current === controller) {
        setSuggestion(payload.suggestion);
        setStatus("ready");
      }
    } catch (error) {
      if (requestControllerRef.current === controller) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error && error.name === "AbortError"
            ? t("ai.errors.timeout")
            : error instanceof Error
              ? error.message
              : t("ai.errors.failed")
        );
      }
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
      }
      window.clearTimeout(timeout);
    }
  }

  function closeSuggestion() {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setActiveField(null);
    setSuggestion("");
    setErrorMessage(null);
    setIsEditing(false);
    setStatus("idle");
  }

  function acceptSuggestion() {
    if (!activeField) {
      return;
    }

    setValue(activeField, suggestion, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
    closeSuggestion();
  }

  const activeFieldLabel = activeField ? t(`fields.${activeField}`) : "";

  return (
    <>
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
            labelAction={
              <button
                type="button"
                onClick={() => void requestSuggestion(field)}
                disabled={status === "loading"}
                aria-busy={status === "loading" && activeField === field}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-civic px-3 py-2 text-sm font-semibold text-civic hover:bg-civicSoft disabled:cursor-not-allowed disabled:opacity-50"
              >
                <WandSparkles aria-hidden="true" size={16} />
                {t("ai.helpMeWrite")}
              </button>
            }
          />
        ))}
      </fieldset>

      <AiSuggestionDialog
        open={Boolean(activeField)}
        fieldLabel={activeFieldLabel}
        suggestion={suggestion}
        status={status}
        errorMessage={errorMessage}
        isEditing={isEditing}
        title={t("ai.dialogTitle")}
        description={t("ai.dialogDescription")}
        textareaLabel={t("ai.suggestionLabel")}
        acceptLabel={t("ai.accept")}
        editLabel={t("ai.edit")}
        discardLabel={t("ai.discard")}
        retryLabel={t("ai.retry")}
        loadingLabel={t("ai.loading")}
        onSuggestionChange={setSuggestion}
        onAccept={acceptSuggestion}
        onEdit={() => setIsEditing(true)}
        onDiscard={closeSuggestion}
        onRetry={() => activeField && void requestSuggestion(activeField, suggestion)}
      />
    </>
  );
}

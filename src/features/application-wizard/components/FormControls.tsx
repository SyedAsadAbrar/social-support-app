"use client";

import {useId} from "react";
import {
  type FieldErrors,
  type Path,
  useFormContext
} from "react-hook-form";
import type {ApplicationForm} from "../types";

function fieldError(errors: FieldErrors<ApplicationForm>, name: Path<ApplicationForm>) {
  return name.split(".").reduce<unknown>((value, key) => {
    if (value && typeof value === "object" && key in value) {
      return (value as Record<string, unknown>)[key];
    }

    return undefined;
  }, errors) as {message?: string} | undefined;
}

type BaseFieldProps = {
  name: Path<ApplicationForm>;
  label: string;
  helper?: string;
  errorText: (key: string) => string;
};

type TextFieldProps = BaseFieldProps & {
  type?: "text" | "email" | "tel" | "date" | "number";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "decimal";
};

export function TextField({
  name,
  label,
  helper,
  type = "text",
  autoComplete,
  inputMode,
  errorText
}: TextFieldProps) {
  const id = useId();
  const {
    register,
    formState: {errors}
  } = useFormContext<ApplicationForm>();
  const error = fieldError(errors, name);
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-ink" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={[helper ? helperId : "", error ? errorId : ""]
          .filter(Boolean)
          .join(" ")}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base text-ink shadow-sm transition focus:border-action"
        {...register(name, {
          setValueAs: (value) => {
            if (type !== "number") {
              return value;
            }

            return value === "" ? "" : Number(value);
          }
        })}
      />
      {helper ? (
        <p id={helperId} className="text-sm leading-6 text-slate-600">
          {helper}
        </p>
      ) : null}
      {error?.message ? (
        <p id={errorId} className="text-sm font-medium text-alert" role="alert">
          {errorText(error.message)}
        </p>
      ) : null}
    </div>
  );
}

type SelectFieldProps = BaseFieldProps & {
  placeholder: string;
  options: string[];
  optionLabel: (value: string) => string;
};

export function SelectField({
  name,
  label,
  helper,
  placeholder,
  options,
  optionLabel,
  errorText
}: SelectFieldProps) {
  const id = useId();
  const {
    register,
    formState: {errors}
  } = useFormContext<ApplicationForm>();
  const error = fieldError(errors, name);
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-ink" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={[helper ? helperId : "", error ? errorId : ""]
          .filter(Boolean)
          .join(" ")}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base text-ink shadow-sm transition focus:border-action"
        {...register(name)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabel(option)}
          </option>
        ))}
      </select>
      {helper ? (
        <p id={helperId} className="text-sm leading-6 text-slate-600">
          {helper}
        </p>
      ) : null}
      {error?.message ? (
        <p id={errorId} className="text-sm font-medium text-alert" role="alert">
          {errorText(error.message)}
        </p>
      ) : null}
    </div>
  );
}

type TextAreaFieldProps = BaseFieldProps & {
  rows?: number;
};

export function TextAreaField({
  name,
  label,
  helper,
  rows = 5,
  errorText
}: TextAreaFieldProps) {
  const id = useId();
  const {
    register,
    formState: {errors}
  } = useFormContext<ApplicationForm>();
  const error = fieldError(errors, name);
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-ink" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={[helper ? helperId : "", error ? errorId : ""]
          .filter(Boolean)
          .join(" ")}
        className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base text-ink shadow-sm transition focus:border-action"
        {...register(name)}
      />
      {helper ? (
        <p id={helperId} className="text-sm leading-6 text-slate-600">
          {helper}
        </p>
      ) : null}
      {error?.message ? (
        <p id={errorId} className="text-sm font-medium text-alert" role="alert">
          {errorText(error.message)}
        </p>
      ) : null}
    </div>
  );
}

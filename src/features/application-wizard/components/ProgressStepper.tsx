"use client";

import {Check} from "lucide-react";

type ProgressStepperProps = {
  currentStep: number;
  labels: string[];
};

export function ProgressStepper({currentStep, labels}: ProgressStepperProps) {
  return (
    <nav aria-label="Application progress">
      <ol className="grid gap-3 sm:grid-cols-3">
        {labels.map((label, index) => {
          const isCurrent = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <li key={label}>
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={[
                  "flex min-h-16 items-center gap-3 rounded-md border px-4 py-3",
                  isCurrent
                    ? "border-action bg-white shadow-sm"
                    : isComplete
                      ? "border-civic bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    isCurrent
                      ? "bg-action text-white"
                      : isComplete
                        ? "bg-civic text-white"
                        : "bg-slate-200 text-slate-700"
                  ].join(" ")}
                >
                  {isComplete ? <Check aria-hidden="true" size={18} /> : index + 1}
                </span>
                <span className="text-sm font-semibold text-ink">{label}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

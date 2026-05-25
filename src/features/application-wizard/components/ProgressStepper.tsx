import {classNames} from "@/lib/classNames";

type ProgressStepperProps = {
  currentStep: number;
  labels: string[];
  progressLabel: string;
};

export function ProgressStepper({
  currentStep,
  labels,
  progressLabel
}: ProgressStepperProps) {
  const stepCount = labels.length;
  const safeCurrentStep = Math.min(Math.max(currentStep, 0), Math.max(stepCount - 1, 0));
  const horizontalPaddingPercent = stepCount > 0 ? 50 / stepCount : 0;
  const trackFillPercent =
    stepCount <= 1 ? 0 : (safeCurrentStep / (stepCount - 1)) * 100;

  return (
    <nav
      aria-label={progressLabel}
      className="rounded-lg border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-6"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-ink">{progressLabel}</p>
      </div>

      <div className="relative mt-5">
        {stepCount > 1 ? (
          <div
            aria-hidden="true"
            className="absolute top-5 h-0.5"
            style={{
              left: `${horizontalPaddingPercent}%`,
              right: `${horizontalPaddingPercent}%`
            }}
          >
            <div className="h-full bg-slate-300" />
            <div
              className="absolute inset-y-0 left-0 bg-civic transition-[width] duration-300 ease-out"
              style={{width: `${trackFillPercent}%`}}
            />
          </div>
        ) : null}

        <ol
          className="relative grid gap-2"
          style={{gridTemplateColumns: `repeat(${stepCount}, minmax(0, 1fr))`}}
        >
          {labels.map((label, index) => {
            const isCurrent = index === safeCurrentStep;
            const isComplete = index < safeCurrentStep;

            return (
              <li key={label} className="relative min-w-0">
                <div
                  aria-current={isCurrent ? "step" : undefined}
                  className="grid justify-items-center gap-2 text-center"
                >
                  <span
                    className={classNames(
                      "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                      isComplete
                        ? "border-civic bg-civic text-white"
                        : isCurrent
                          ? "border-civic bg-white text-civic"
                          : "border-slate-300 bg-slate-50 text-slate-700"
                    )}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={classNames(
                      "max-w-full truncate text-xs font-semibold uppercase sm:text-sm",
                      isComplete
                        ? "text-ink"
                        : isCurrent
                          ? "text-civic"
                          : "text-slate-500"
                    )}
                  >
                    {label}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

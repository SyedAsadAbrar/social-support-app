"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Check, LoaderCircle, Pencil, RotateCcw, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Locale } from "@/i18n/config";
import { classNames } from "@/lib/classNames";

type AiSuggestionDialogProps = {
  open: boolean;
  locale: Locale;
  fieldLabel: string;
  suggestion: string;
  status: "idle" | "loading" | "ready" | "error";
  errorMessage: string | null;
  isEditing: boolean;
  acceptLabel: string;
  editLabel: string;
  discardLabel: string;
  retryLabel: string;
  loadingLabel: string;
  title: string;
  description: string;
  textareaLabel: string;
  onSuggestionChange: (value: string) => void;
  onAccept: () => void;
  onEdit: () => void;
  onDiscard: () => void;
  onRetry: () => void;
};

export function AiSuggestionDialog({
  open,
  locale,
  fieldLabel,
  suggestion,
  status,
  errorMessage,
  isEditing,
  acceptLabel,
  editLabel,
  discardLabel,
  retryLabel,
  loadingLabel,
  title,
  description,
  textareaLabel,
  onSuggestionChange,
  onAccept,
  onEdit,
  onDiscard,
  onRetry,
}: AiSuggestionDialogProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isRtl = dir === "rtl";

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onDiscard()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/45" />
        <Dialog.Content
          dir={dir}
          className="fixed left-1/2 top-1/2 z-50 grid max-h-[90vh] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 gap-5 overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 text-start shadow-panel sm:p-6"
        >
          <div className={classNames("flex items-start justify-between gap-4")}>
            <div
              className={classNames(
                "min-w-0 flex-1",
                isRtl ? "text-right" : "text-left",
              )}
            >
              <Dialog.Title className="text-xl font-bold text-ink">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </Dialog.Description>
              <p className="mt-3 text-sm font-semibold text-civic">
                {fieldLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={onDiscard}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-slate-200 text-ink hover:bg-slate-50"
              aria-label={discardLabel}
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>

          {status === "loading" ? (
            <div
              role="status"
              aria-live="polite"
              className="flex min-h-36 items-center justify-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-ink flex-row"
            >
              <LoaderCircle
                aria-hidden="true"
                className="animate-spin text-civic"
                size={20}
              />
              {loadingLabel}
            </div>
          ) : null}

          {status === "error" ? (
            <div
              role="alert"
              className={classNames(
                "rounded-md border border-alert/30 bg-red-50 p-4 text-sm font-medium leading-6 text-alert",
                isRtl ? "text-right" : "text-left",
              )}
            >
              {errorMessage}
            </div>
          ) : null}

          {status === "ready" ? (
            <div
              className={classNames(
                "grid gap-2",
                isRtl ? "text-right" : "text-left",
              )}
            >
              <label
                className="text-sm font-semibold text-ink"
                htmlFor="ai-suggestion-text"
              >
                {textareaLabel}
              </label>
              <textarea
                id="ai-suggestion-text"
                ref={textareaRef}
                rows={8}
                readOnly={!isEditing}
                value={suggestion}
                onChange={(event) => onSuggestionChange(event.target.value)}
                dir={dir}
                className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-start text-base leading-7 text-ink shadow-sm transition focus:border-civic read-only:bg-slate-50"
              />
            </div>
          ) : null}

          <div
            className={classNames(
              "flex gap-3 border-t border-slate-200 pt-4 sm:items-center sm:justify-between",
              "flex-col-reverse sm:flex-row",
            )}
          >
            <button
              type="button"
              onClick={onDiscard}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50 flex-row"
            >
              <X aria-hidden="true" size={18} />
              {discardLabel}
            </button>

            <div className="flex gap-3 sm:items-center flex-col sm:flex-row">
              {status === "error" ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className={classNames(
                    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-civic px-4 py-2 text-sm font-semibold text-civic hover:bg-civicSoft",
                    isRtl ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <RotateCcw aria-hidden="true" size={18} />
                  {retryLabel}
                </button>
              ) : null}

              {status === "ready" ? (
                <>
                  <button
                    type="button"
                    onClick={onRetry}
                    className={classNames(
                      "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-civic px-4 py-2 text-sm font-semibold text-civic hover:bg-civicSoft",
                      isRtl ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <RotateCcw aria-hidden="true" size={18} />
                    {retryLabel}
                  </button>
                  <button
                    type="button"
                    onClick={onEdit}
                    disabled={isEditing}
                    className={classNames(
                      "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-civic px-4 py-2 text-sm font-semibold text-civic hover:bg-civicSoft disabled:cursor-not-allowed disabled:opacity-50",
                      isRtl ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <Pencil aria-hidden="true" size={18} />
                    {editLabel}
                  </button>
                  <button
                    type="button"
                    onClick={onAccept}
                    disabled={!suggestion.trim()}
                    className={classNames(
                      "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-civic px-4 py-2 text-sm font-semibold text-white hover:bg-civic/90 disabled:cursor-not-allowed disabled:opacity-50",
                      isRtl ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <Check aria-hidden="true" size={18} />
                    {acceptLabel}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {Check, LoaderCircle, Pencil, RotateCcw, X} from "lucide-react";
import {useEffect, useRef} from "react";

type AiSuggestionDialogProps = {
  open: boolean;
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
  onRetry
}: AiSuggestionDialogProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && onDiscard()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/45" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 grid max-h-[90vh] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 gap-5 overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 shadow-panel sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-bold text-ink">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </Dialog.Description>
              <p className="mt-3 text-sm font-semibold text-civic">{fieldLabel}</p>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-slate-200 text-ink hover:bg-slate-50"
                aria-label={discardLabel}
              >
                <X aria-hidden="true" size={18} />
              </button>
            </Dialog.Close>
          </div>

          {status === "loading" ? (
            <div
              role="status"
              aria-live="polite"
              className="flex min-h-36 items-center justify-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-ink"
            >
              <LoaderCircle aria-hidden="true" className="animate-spin text-civic" size={20} />
              {loadingLabel}
            </div>
          ) : null}

          {status === "error" ? (
            <div
              role="alert"
              className="rounded-md border border-alert/30 bg-red-50 p-4 text-sm font-medium leading-6 text-alert"
            >
              {errorMessage}
            </div>
          ) : null}

          {status === "ready" ? (
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-ink" htmlFor="ai-suggestion-text">
                {textareaLabel}
              </label>
              <textarea
                id="ai-suggestion-text"
                ref={textareaRef}
                rows={8}
                readOnly={!isEditing}
                value={suggestion}
                onChange={(event) => onSuggestionChange(event.target.value)}
                className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-base leading-7 text-ink shadow-sm transition focus:border-civic read-only:bg-slate-50"
              />
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onDiscard}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50"
            >
              <X aria-hidden="true" size={18} />
              {discardLabel}
            </button>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {status === "error" ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-civic px-4 py-2 text-sm font-semibold text-civic hover:bg-civicSoft"
                >
                  <RotateCcw aria-hidden="true" size={18} />
                  {retryLabel}
                </button>
              ) : null}

              {status === "ready" ? (
                <>
                  <button
                    type="button"
                    onClick={onEdit}
                    disabled={isEditing}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-civic px-4 py-2 text-sm font-semibold text-civic hover:bg-civicSoft disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Pencil aria-hidden="true" size={18} />
                    {editLabel}
                  </button>
                  <button
                    type="button"
                    onClick={onAccept}
                    disabled={!suggestion.trim()}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-civic px-4 py-2 text-sm font-semibold text-white hover:bg-civic/90 disabled:cursor-not-allowed disabled:opacity-50"
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

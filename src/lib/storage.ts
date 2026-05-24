import type {ApplicationForm} from "@/features/application-wizard/types";

export const draftStorageKey = "social-support-application:v1";

type StoredDraft = {
  version: 1;
  values: Partial<ApplicationForm>;
  savedAt: string;
};

function isStoredDraft(value: unknown): value is StoredDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<StoredDraft>;
  return candidate.version === 1 && Boolean(candidate.values);
}

export function loadDraft(): Partial<ApplicationForm> | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(draftStorageKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;
    return isStoredDraft(parsed) ? parsed.values : null;
  } catch {
    return null;
  }
}

export function saveDraft(values: Partial<ApplicationForm>) {
  if (typeof window === "undefined") {
    return;
  }

  const draft: StoredDraft = {
    version: 1,
    values,
    savedAt: new Date().toISOString()
  };

  window.localStorage.setItem(draftStorageKey, JSON.stringify(draft));
}

export function clearDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(draftStorageKey);
}

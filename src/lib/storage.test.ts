import {beforeEach, describe, expect, it} from "vitest";
import {clearDraft, draftStorageKey, loadDraft, saveDraft} from "./storage";

describe("draft storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves and restores draft values with the current step", () => {
    saveDraft({name: "Amina"}, 2);

    expect(loadDraft()).toMatchObject({
      values: {name: "Amina"},
      currentStep: 2
    });
  });

  it("clears all social support localStorage keys only", () => {
    window.localStorage.setItem(draftStorageKey, "draft");
    window.localStorage.setItem("social-support-application:v0", "old");
    window.localStorage.setItem("unrelated", "keep");

    clearDraft();

    expect(window.localStorage.getItem(draftStorageKey)).toBeNull();
    expect(window.localStorage.getItem("social-support-application:v0")).toBeNull();
    expect(window.localStorage.getItem("unrelated")).toBe("keep");
  });

  it("drops legacy completed submission snapshots", () => {
    window.localStorage.setItem(
      draftStorageKey,
      JSON.stringify({
        version: 1,
        values: {name: "Amina"},
        currentStep: 3,
        submissionResult: {
          applicationId: "SSA-123",
          submittedAt: new Date().toISOString()
        },
        savedAt: new Date().toISOString()
      })
    );

    expect(loadDraft()).toBeNull();
    expect(window.localStorage.getItem(draftStorageKey)).toBeNull();
  });
});

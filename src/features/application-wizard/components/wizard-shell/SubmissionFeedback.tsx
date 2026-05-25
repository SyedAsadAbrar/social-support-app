type SubmissionFeedbackProps = {
  error: string | null;
};

export function SubmissionFeedback({error}: SubmissionFeedbackProps) {
  return (
    <>
      {error ? (
        <div
          role="alert"
          className="rounded-md border border-alert/30 bg-red-50 p-4 text-sm font-medium text-alert"
        >
          {error}
        </div>
      ) : null}
    </>
  );
}

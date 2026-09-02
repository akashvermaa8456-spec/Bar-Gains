export function PersistenceNotice() {
  return (
    <p className="rounded-xl bg-gold-light px-4 py-3 text-sm text-ink" role="status">
      Submissions are not stored yet. Database-backed forms are planned for the next phase. Nothing you send on this
      page is saved.
    </p>
  );
}

export const PHASE1_SUBMIT_MESSAGE =
  "Thanks — the form is valid. Saving to our database is not connected yet (Phase 3). Your details were not stored.";

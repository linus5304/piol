/** Validate that all required checklist items are checked before approval. */
export function validateApproval(
  checklist: Record<string, boolean>,
  requiredIds: string[],
  t: (key: string) => string
): string | null {
  const allChecked = requiredIds.every((id) => checklist[id]);
  return allChecked ? null : t('validation.checklistIncomplete');
}

/** Validate that rejection notes are provided. */
export function validateRejection(notes: string, t: (key: string) => string): string | null {
  return notes.trim() ? null : t('validation.rejectionNotesRequired');
}

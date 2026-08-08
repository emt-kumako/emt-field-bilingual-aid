/** How tapping an option changes the selected id set. */

export type SelectionMode = "single" | "multi";

export type OptionMeta = {
  id: string;
  exclusive?: boolean;
  /** Mutually exclusive within this group only (e.g. dialysis side). */
  mutexGroup?: string;
};

/**
 * Pure Option selection: current ids + catalog meta + click → next ids.
 * Does not own body-lock, notes, or Case persistence.
 */
export function nextSelectedIds(
  selectedIds: readonly string[],
  options: readonly OptionMeta[],
  clickedId: string,
  mode: SelectionMode = "multi",
): string[] {
  const option = options.find((o) => o.id === clickedId);
  if (!option) return [...selectedIds];

  const byId = (id: string) => options.find((o) => o.id === id);

  if (mode === "single") {
    if (selectedIds.includes(clickedId) && !option.exclusive) {
      return [];
    }
    return [clickedId];
  }

  if (option.exclusive) {
    return selectedIds.includes(clickedId) ? [] : [clickedId];
  }

  let next = selectedIds.filter((id) => !byId(id)?.exclusive);
  if (option.mutexGroup) {
    next = next.filter((id) => byId(id)?.mutexGroup !== option.mutexGroup);
  }
  const set = new Set(next);
  if (set.has(clickedId)) set.delete(clickedId);
  else set.add(clickedId);
  return [...set];
}

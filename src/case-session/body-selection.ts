import { getBodyRegion } from "../catalog/chief-complaint-1.js";

/** Coarse regions, optional subregions, and open drilldown target. */
export type BodySelection = {
  bodyRegionIds: string[];
  bodySubregionIds: string[];
  drilldownRegionId: string | null;
};

/**
 * Toggle a coarse body region. Unknown region id → null (caller keeps prior state).
 * Selecting a region with subregions opens drilldown for that region.
 */
export function toggleRegion(
  selection: BodySelection,
  regionId: string,
): BodySelection | null {
  const region = getBodyRegion(regionId);
  if (!region) return null;

  const selected = new Set(selection.bodyRegionIds);
  if (selected.has(regionId)) {
    selected.delete(regionId);
    const subIds = new Set(region.subregions.map((s) => s.id));
    return {
      bodyRegionIds: [...selected],
      bodySubregionIds: selection.bodySubregionIds.filter((id) => !subIds.has(id)),
      drilldownRegionId:
        selection.drilldownRegionId === regionId
          ? null
          : selection.drilldownRegionId,
    };
  }

  selected.add(regionId);
  return {
    bodyRegionIds: [...selected],
    bodySubregionIds: selection.bodySubregionIds,
    drilldownRegionId:
      region.subregions.length > 0 ? regionId : selection.drilldownRegionId,
  };
}

export function toggleSubregion(
  selection: BodySelection,
  subregionId: string,
): BodySelection {
  const set = new Set(selection.bodySubregionIds);
  if (set.has(subregionId)) set.delete(subregionId);
  else set.add(subregionId);
  return {
    ...selection,
    bodySubregionIds: [...set],
  };
}

export function clearDrilldown(selection: BodySelection): BodySelection {
  return { ...selection, drilldownRegionId: null };
}

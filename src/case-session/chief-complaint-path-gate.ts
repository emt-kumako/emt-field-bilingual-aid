import {
  canCompleteChiefComplaint1,
  getChiefComplaint1Detail,
  needsBodyLocation,
  usesTraumaPrimary,
} from "./chief-complaint-1.js";
import { canCompleteChestOpqrst } from "./chest-opqrst.js";
import { canCompleteChiefComplaintDuration } from "./chief-complaint-duration.js";
import { canCompleteChiefComplaintQuality } from "./chief-complaint-quality.js";
import { type CaseState, type GateReason } from "./types.js";

export type ChiefComplaintPathGate = {
  reason: GateReason | null;
  nextEnabled: boolean;
};

/** Soft gate for steps on the chief complaint path. */
export function gateForChiefComplaintPath(
  state: CaseState,
): ChiefComplaintPathGate {
  switch (state.currentStep) {
    case "chief_complaint_1": {
      if (canCompleteChiefComplaint1(state)) {
        return { reason: null, nextEnabled: true };
      }
      const detail = getChiefComplaint1Detail(state);
      if (usesTraumaPrimary(state)) {
        if (detail.traumaStage === "mechanism") {
          if (!detail.traumaTraffic) {
            return { reason: "need_trauma_mechanism", nextEnabled: false };
          }
          if (detail.traumaTraffic === "traffic" && !detail.traumaVehicleId) {
            return { reason: "need_trauma_vehicle", nextEnabled: false };
          }
          if (
            detail.traumaTraffic === "non_traffic" &&
            !detail.traumaInjuryTypeId
          ) {
            return { reason: "need_trauma_mechanism", nextEnabled: false };
          }
          return { reason: "need_trauma_mechanism", nextEnabled: false };
        }
        return { reason: "need_body_location", nextEnabled: false };
      }
      if (detail.complaintTypeIds.length === 0) {
        return { reason: "need_complaint_type", nextEnabled: false };
      }
      if (needsBodyLocation(state) && detail.bodyRegionIds.length === 0) {
        return { reason: "need_body_location", nextEnabled: false };
      }
      return { reason: "need_complaint_type", nextEnabled: false };
    }
    case "chest_opqrst":
      return canCompleteChestOpqrst(state)
        ? { reason: null, nextEnabled: true }
        : { reason: "need_opqrst", nextEnabled: false };
    case "chief_complaint_quality":
      return canCompleteChiefComplaintQuality(state)
        ? { reason: null, nextEnabled: true }
        : { reason: "need_quality_or_pain", nextEnabled: false };
    case "chief_complaint_duration":
      return canCompleteChiefComplaintDuration(state)
        ? { reason: null, nextEnabled: true }
        : { reason: "need_duration", nextEnabled: false };
    default:
      return { reason: null, nextEnabled: true };
  }
}

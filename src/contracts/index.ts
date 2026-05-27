// Path in repo: src/contracts/index.ts
// FieldLogic Pro -- Contract module public API
//
// Routes contract generation by state to the correct template module.
// Add new states by adding a case to the buildContract switch.
// =====================================================================

import { buildCaliforniaHomeImprovementContract } from "./states/california/home-improvement";
import { getContractor } from "./contractor-config";
import type { ContractInputs, ContractOutput, ContractorConfig } from "./types";

export * from "./types";
export { CALIFORNIA_BATHROOMS_CONFIG, CONTRACTOR_REGISTRY, getContractor } from "./contractor-config";
export { buildCaliforniaHomeImprovementContract } from "./states/california/home-improvement";

/**
 * Build a contract for any FieldLogic Pro contractor in any supported state.
 *
 * The contractor's `primaryState` field determines which state's template is used.
 * Currently supported: California (CA).
 *
 * Future states plug in here:
 *   case "FL": return buildFloridaHomeImprovementContract(inputs);
 *   case "TX": return buildTexasHomeImprovementContract(inputs);
 *   case "AZ": return buildArizonaHomeImprovementContract(inputs);
 */
export function buildContract(inputs: ContractInputs): ContractOutput {
  const state = inputs.contractor.primaryState;

switch (state) {
  case "CA":
    return buildCaliforniaHomeImprovementContract(inputs);
  default:
    throw new Error(
      `FieldLogic Pro contract template not yet implemented for state: ${state}. ` +
      `Currently supported: CA. Open a ticket to add this state's compliance template.`,
      );
}
}

/**
 * Convenience: build a contract for a known contractor by ID + the rest of the inputs.
 */
export function buildContractForContractor(
  contractorId: string,
  inputs: Omit<ContractInputs, "contractor">,
  ): ContractOutput {
  const contractor: ContractorConfig = getContractor(contractorId);
  return buildContract({ ...inputs, contractor });
}

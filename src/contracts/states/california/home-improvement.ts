// Path in repo: src/contracts/states/california/home-improvement.ts
// FieldLogic Pro -- California Home Improvement Contract template
//
// PHASE 1 STUB. Full lump-sum CSLB-compliant template (v1.1.0-ca-lumpsum,
// ~52KB) is staged in Bill's outputs as contracts-california-home-improvement.ts
// and dropped in locally before Phase 2. This stub exists only so the repo
// compiles for the Phase 1 vision-pipeline deploy.
// =====================================================================

import type { ContractInputs, ContractOutput } from "../../types";
import { ContractValidationError } from "../../types";

export function validateContractInputs(inputs: ContractInputs): void {
  throw new ContractValidationError(
    "template",
    "California contract template not yet deployed. Apply v1.1.0-ca-lumpsum from local repo before use.",
    );
}

export function buildCaliforniaHomeImprovementContract(
  inputs: ContractInputs,
  ): ContractOutput {
  validateContractInputs(inputs);
  throw new ContractValidationError("template", "Unreachable in stub.");
}

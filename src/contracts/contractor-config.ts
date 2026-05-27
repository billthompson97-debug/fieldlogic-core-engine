// Path in repo: src/contracts/contractor-config.ts
// FieldLogic Pro -- Contractor instance configurations
//
// CBI is the FIRST FieldLogic Pro contractor tenant (id = "cbi-001").
// Each future FieldLogic Pro contractor adds their own export here.
// The template logic in src/contracts/states/*/ stays identical for all.
// =====================================================================

import type { ContractorConfig } from "./types";

export const CALIFORNIA_BATHROOMS_CONFIG: ContractorConfig = {
  id: "cbi-001",
  legalName: "California Bathrooms, Inc.",
  doingBusinessAs: "California Bathrooms",
  contractorLicenseNumber: "1086293",
  primaryState: "CA",
  physicalAddress: {
    street: "8250 Ronson Road",
    city: "San Diego",
    state: "CA",
    postalCode: "92111",
    country: "USA",
  },
  phone: "(619) 649-8918",
  cancellationEmail: "cancel@calibathrooms.com",
  cglInsuranceCarrier: "Nationwide General Insurance Company",
  cglInsuranceCarrierPhone: "(203) 542-3800",
  carriesWorkersComp: true,
  defaultDownPaymentPercent: 0.1,
  warrantyOptions: {
    hasBathConceptsHTP: true,
    hasWalkInTub: true,
  },
};

export const CONTRACTOR_REGISTRY: Record<string, ContractorConfig> = {
  "cbi-001": CALIFORNIA_BATHROOMS_CONFIG,
};

export function getContractor(id: string): ContractorConfig {
  const config = CONTRACTOR_REGISTRY[id];
  if (!config) throw new Error(`Unknown contractor ID: ${id}`);
  return config;
}

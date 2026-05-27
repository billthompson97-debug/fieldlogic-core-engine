// Path in repo: src/contracts/types.ts
// FieldLogic Pro -- Contract module type definitions
//
// Architecture: state-templatable, contractor-parameterized.
// Each state (CA, FL, TX, AZ...) has its own template module.
// Each contractor instance (CBI is the first) plugs in their own config.
//
// CBI uses LUMP SUM contracts -- a single "Investment Price."
// No itemized line items are shown to the customer. Cost detail stays
// internal to the Estimator + Margin Gate.
// =====================================================================

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export interface ContractorConfig {
  id: string;
  legalName: string;
  doingBusinessAs?: string;
  contractorLicenseNumber: string;
  primaryState: string;
  physicalAddress: Address;
  mailingAddress?: Address;
  phone: string;
  cancellationEmail: string;
  cglInsuranceCarrier: string;
  cglInsuranceCarrierPhone: string;
  carriesWorkersComp: boolean;
  defaultDownPaymentPercent: number;
  warrantyOptions: {
  hasBathConceptsHTP: boolean;
  hasWalkInTub: boolean;
  };
}

export interface Salesperson {
  crmMembershipId?: string;
  name: string;
  registrationNumber: string;
}

export interface Customer {
  primaryOwnerName: string;
  secondaryOwnerName?: string;
  homeAddress: Address;
  businessAddress?: Address;
  email: string;
  phone: string;
  isSenior: boolean;
}

export interface InternalLineItem {
  name: string;
  description?: string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
  catalogSku?: string;
}

export interface ProgressPayment {
  name: string;
  amount?: number;
  percentage?: number;
  description: string;
}

export interface Project {
  jobSiteAddress: Address;
  legalDescription?: string;
  scopeDescription: string;
  substantialCommencementDescription: string;
  approximateStartDate: Date;
  approximateCompletionDate: Date;
  contractPrice: number;
  internalTotalCost?: number;
  downPayment: number;
  progressPayments: ProgressPayment[];
  usesSubcontractors: boolean;
  isDisasterRepair: boolean;
  internalCostBreakdown?: InternalLineItem[];
}

export interface ContractInputs {
  contractor: ContractorConfig;
  customer: Customer;
  salesperson: Salesperson;
  project: Project;
  contractDate?: Date;
}

export interface ContractLineItem {
  name: string;
  description?: string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
}

export interface ContractOutput {
  name: string;
  coverPageTitle: string;
  coverPageSubtitle: string;
  description: string;
  footer: string;
  signatureDisclaimer: string;
  requireSignature: boolean;
  lineItems: ContractLineItem[];
  scheduledDocuments: Array<{
  name: string;
  amount?: number;
  percentage?: number;
  }>;
  paymentMethods: string[];
  allowPartialPayments: boolean;
  displayFlags: {
  showQuantity: boolean;
  showChildCosts: boolean;
  showProfit: boolean;
  showFinancing: boolean;
  };
  metadata: {
  state: string;
  template: string;
  version: string;
  contractorId: string;
  pricingMode: "lump_sum" | "itemized";
  generatedAt: string;
  };
}

export class ContractValidationError extends Error {
  constructor(
    public field: string,
    message: string,
    ) {
    super(`[${field}] ${message}`);
    this.name = "ContractValidationError";
  }
}

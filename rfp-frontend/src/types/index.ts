export interface Vendor {
  _id: string;
  name: string;
  email: string;
  category: string;
}

export interface Rfp {
  _id: string;
  userRequest: string;
  structuredData: {
    items: string[];
    budget: number;
    deadline?: string;
    requirements?: string[];
  };
  status: string;
}

export interface Proposal {
  _id: string;
  rfpId: string;
  vendorName: string;
  price: number;
  deliveryDate: string;
  warranty: string;
  rawEmailBody: string;
}

export interface AiVerdict {
  recommendedVendor: string;
  reason: string;
  score: number;
  comparisonSummary: string;
}


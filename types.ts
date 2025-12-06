
// Data Models for AutoLead SA

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  CONVERTED = 'CONVERTED',
  ARCHIVED = 'ARCHIVED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DEALER';
  dealerId?: string; // If role is DEALER, this links to the specific dealership
  avatar?: string;
}

export interface BillingProfile {
  plan: 'Standard' | 'Pro' | 'Enterprise';
  costPerLead: number; // e.g. 250 (ZAR)
  credits: number; // For pre-paid model
  totalSpent: number;
  lastBilledDate: string;
  currentUnbilledAmount: number;
}

export interface Dealership {
  id: string;
  name: string;
  brand: string;
  region: string;
  contactPerson: string;
  email: string;
  status: 'Active' | 'Pending';
  leadsAssigned: number;
  maxLeadsCapacity?: number; // Optional cap for distribution logic
  billing: BillingProfile;
}

export interface Lead {
  id: string;
  brand: string;
  model: string;
  source: string;
  intentSummary: string;
  dateDetected: string;
  status: LeadStatus;
  sentiment?: string; // Added for Lead Scoring
  potentialValue?: string;
  region: string;
  groundingUrl?: string;
  // Contact Details
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  // Context
  contextDealer?: string; // The dealer associated with the finding (e.g. Competitor or Listing Owner)
  // Distribution
  assignedDealerId?: string; // ID of the dealer this lead was distributed to
  assignmentType?: 'Direct' | 'Fallback' | 'National'; // How the lead was routed
  // Reminders
  followUpDate?: string; // ISO String for scheduled reminder
}

export interface NaamsaBrand {
  id: string;
  name: string;
  tier: 'Volume' | 'Luxury' | 'Commercial';
}

export interface MarketInsight {
  topic: string;
  sentiment: string;
  summary: string;
  sources: Array<{ title: string; uri: string }>;
  // Extracted public info
  extractedContact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  contextDealer?: string;
}

export type ViewState = 'DASHBOARD' | 'LEAD_FINDER' | 'MY_LEADS' | 'DEALER_NETWORK' | 'BILLING' | 'MARKETING' | 'POPIA_COMPLIANCE' | 'ONBOARDING' | 'ABOUT';

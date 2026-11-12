export interface LeadData {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  company: string;
  timestamp: string;
}

export interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  company?: string;
}


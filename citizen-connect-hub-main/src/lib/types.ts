export type ComplaintStatus = 'pending' | 'assigned' | 'in_progress' | 'resolved';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ComplaintCategory = 'roads' | 'water_supply' | 'electricity' | 'sanitation' | 'street_lights' | 'others';
export type UserRole = 'citizen' | 'admin' | 'department_head' | 'field_officer';

export interface Department {
  id: string;
  name: string;
  category_handled: ComplaintCategory;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  department_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  complaint_id: string;
  user_id: string | null;
  category: ComplaintCategory;
  description: string;
  text_from_voice: string | null;
  location_lat: number | null;
  location_lng: number | null;
  address: string | null;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  department_id: string | null;
  assigned_to: string | null;
  expected_resolution_date: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComplaintMedia {
  id: string;
  complaint_id: string;
  file_url: string;
  file_type: string;
  file_name: string | null;
  created_at: string;
}

export interface StatusUpdate {
  id: string;
  complaint_id: string;
  status: ComplaintStatus;
  remarks: string | null;
  updated_by: string | null;
  before_photo_url: string | null;
  after_photo_url: string | null;
  created_at: string;
}

export const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  roads: 'Roads & Infrastructure',
  water_supply: 'Water Supply',
  electricity: 'Electricity',
  sanitation: 'Sanitation',
  street_lights: 'Street Lights',
  others: 'Others',
};

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export const PRIORITY_LABELS: Record<ComplaintPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

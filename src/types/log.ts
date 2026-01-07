export interface LogApiResponse {
  id: string;
  userId: string;
  action: string;
  module: string;
  details?: Record<string, unknown> | null;
  createdAt: string;
  user: { 
    id: string;
    name: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export interface LogItem {
  id: string;
  activityType: string;
  module: string;
  date: string;
  clientName?: string;
}

export interface LogsPaginatedResponse {
  data: LogApiResponse[];
  total: number;
  page: number;
  totalPages: number;
}
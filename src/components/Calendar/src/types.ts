export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  joiners?: string;
  date: string;
  startTime: string;
  endTime: string;
  color?: string;
  completed?: boolean;
  status?: number;
  sdate?: string;
  edate?: string;
}

// 后端活动数据结构
export interface Activity {
  id: number;
  intro: string;
  detail: string;
  sdate: string;
  edate: string;
  joiners: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityRequest {
  intro: string;
  detail: string;
  sdate: string;
  edate: string;
  joiners: string;
  status: number;
}

export interface UpdateActivityRequest {
  intro?: string;
  detail?: string;
  sdate?: string;
  edate?: string;
  joiners?: string;
  status?: number;
}

export interface CalendarProps {
  events?: CalendarEvent[];
  showSidebar?: boolean;
  showActions?: boolean;
  showCheckbox?: boolean;
}

export interface CalendarEmits {
  (e: "add", event: Omit<CalendarEvent, "id">): void;
  (e: "edit", event: CalendarEvent): void;
  (e: "delete", eventId: string): void;
  (e: "delete-multiple", eventIds: string[]): void;
  (e: "toggle-complete", eventId: string, completed: boolean): void;
}

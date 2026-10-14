export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Role = 'user' | 'admin';
export type ActivityStatus = 'active' | 'inactive';
export type UserStatus = 'active' | 'inactive';
export type ActivityResultStatus = 'completed' | 'failed' | 'in-progress';
export type ActivityType = 'individual' | 'group';

export interface Team {
  id: string;
  name: string;
  color: string;
  score: number;
  activitiesCompleted: number;
  rank: number;
  status: 'active' | 'inactive';
  description: string;
}

export interface User {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  teamId: string;
  teamName: string;
  score: number;
  rank: number;
  status: UserStatus;
  role: Role;
  activitiesCompleted: number;
  avatarColor: string;
  joinedDate: string;
  lastActive: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  instructions: string;
  difficulty: Difficulty;
  timeLimit: number; // seconds
  maxScore: number;
  passingScore: number;
  status: ActivityStatus;
  category: string;
  activityType: ActivityType;
  questions: ActivityQuestion[];
  completions: number;
  avgScore: number;
}

export interface LiveGroupSession {
  id: string;
  activityId: string;
  activityName: string;
  groupId: string;
  groupName: string;
  groupColor: string;
  maxScore: number;
  timeLimit: number;
  remainingSeconds: number;
  status: 'running' | 'paused' | 'completed';
}


export interface ActivityQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  activityId: string;
  activityName: string;
  difficulty: Difficulty;
  score: number;
  timeTaken: number; // seconds
  status: ActivityResultStatus;
  date: string;
}

export interface AdminLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export interface PaginationMeta {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}



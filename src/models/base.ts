/**
 * Color information used across different entities
 */
export interface ColorInfo {
  color: string;
  isDark: boolean;
}

/**
 * Task priority levels
 */
export enum TaskPriority {
  Low = 0,
  General = 1,
  Medium = 2,
  High = 3,
}

/**
 * Avatar mode
 */
export enum AvatarMode {
  Initials = 0,
  Upload = 1,
  Avatar = 2,
}

/**
 * Entity kind/type
 */
export enum Kind {
  Task = 'Task',
  Document = 'Document',
  Milestone = 'Milestone',
  User = 'User',
}

/**
 * Task follower
 */
export interface TaskFollower {
  [userId: string]: 'creator';
}

/**
 * Custom field value
 */
export interface CustomField {
  id: string;
  value: string | string[];
}


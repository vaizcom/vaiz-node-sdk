/**
 * Color information used across different entities
 */
export interface ColorInfo {
  color: string;
  isDark: boolean;
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

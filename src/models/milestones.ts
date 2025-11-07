/**
 * Milestone
 */
export interface Milestone {
  id: string;
  name: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Milestone response
 */
export interface MilestoneResponse {
  milestone: Milestone;
}

/**
 * Milestones response
 */
export interface MilestonesResponse {
  milestones: Milestone[];
}

/**
 * Create milestone request
 */
export interface CreateMilestoneRequest {
  name: string;
  board: string;
  project: string;
  description?: string;
  dueStart?: string;
  dueEnd?: string;
  tags?: string[];
  color?: string;
}

/**
 * Create milestone response
 */
export interface CreateMilestoneResponse {
  milestone: Milestone;
}

/**
 * Edit milestone request
 */
export interface EditMilestoneRequest {
  milestoneId: string;
  name?: string;
  description?: string;
  dueDate?: string;
}

/**
 * Edit milestone response
 */
export interface EditMilestoneResponse {
  milestone: Milestone;
}

/**
 * Toggle milestone request
 */
export interface ToggleMilestoneRequest {
  milestoneId: string;
  completed: boolean;
}

/**
 * Toggle milestone response
 */
export interface ToggleMilestoneResponse {
  milestone: Milestone;
}

/**
 * Get milestone response
 */
export interface GetMilestoneResponse {
  milestone: Milestone;
}


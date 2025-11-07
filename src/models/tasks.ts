import { TaskPriority, TaskFollower, CustomField, Kind } from './base';

/**
 * Task file attachment
 */
export interface TaskFile {
  url: string;
  name: string;
  ext: string;
  id: string;
  type: string;
  dimension?: number[];
  size?: number;
}

/**
 * Task upload file (for automatic file upload)
 */
export interface TaskUploadFile {
  path: string;
  type?: string;
}

/**
 * Create task request
 */
export interface CreateTaskRequest {
  name: string;
  board: string;
  group?: string;
  project?: string;
  description?: string;
  priority?: TaskPriority;
  completed?: boolean;
  assignees?: string[];
  types?: string[];
  parentTask?: string;
  subtasks?: string[];
  milestones?: string[];
  dueStart?: string;
  dueEnd?: string;
  blockers?: string[];
  blocking?: string[];
  customFields?: CustomField[];
  files?: TaskFile[];
  followers?: TaskFollower;
}

/**
 * Edit task request
 */
export interface EditTaskRequest {
  taskId: string;
  name?: string;
  priority?: TaskPriority;
  completed?: boolean;
  assignees?: string[];
  types?: string[];
  parentTask?: string;
  subtasks?: string[];
  milestones?: string[];
  dueStart?: string;
  dueEnd?: string;
  blockers?: string[];
  blocking?: string[];
  customFields?: CustomField[];
  description?: string;
  files?: TaskFile[];
  followers?: TaskFollower;
}

/**
 * Task response data
 */
export interface Task {
  id: string;
  slug: string;
  name: string;
  description?: string;
  priority: TaskPriority;
  boardTypeId: string;
  projectId: string;
  assigneeIds: string[];
  followers: TaskFollower;
  customFields: CustomField[];
  files: TaskFile[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Task API response
 */
export interface TaskResponse {
  task: Task;
}

/**
 * Get tasks request
 */
export interface GetTasksRequest {
  ids?: string[];
  limit?: number;
  skip?: number;
  board?: string;
  project?: string;
  assignees?: string[];
  parentTask?: string;
  milestones?: string[];
  completed?: boolean;
  archived?: boolean;
}

/**
 * Get tasks response
 */
export interface GetTasksResponse {
  tasks: Task[];
  total: number;
}

/**
 * History item
 */
export interface HistoryItem {
  id: string;
  kind: Kind;
  action: string;
  userId: string;
  createdAt: string;
  changes?: Record<string, any>;
}

/**
 * Get history request
 */
export interface GetHistoryRequest {
  kind: Kind;
  kindId: string;
  limit?: number;
  offset?: number;
}

/**
 * Get history response
 */
export interface GetHistoryResponse {
  histories: HistoryItem[];
  total: number;
}

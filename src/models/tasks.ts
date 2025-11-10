import { TaskFollower, CustomField } from './base';
import { Kind, TaskPriority } from './enums';

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
 *
 * Note: The blockers/blocking fields are automatically transformed to leftConnectors/rightConnectors
 * when sent to the Vaiz API. Use blockers for tasks that block this task, and blocking for tasks
 * that this task blocks.
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
  /** Task IDs that block this task (automatically sent as leftConnectors to API) */
  blockers?: string[];
  /** Task IDs that this task blocks (automatically sent as rightConnectors to API) */
  blocking?: string[];
  customFields?: CustomField[];
  files?: TaskFile[];
  followers?: TaskFollower;
}

/**
 * Edit task request
 *
 * Note: The blockers/blocking fields are automatically transformed to leftConnectors/rightConnectors
 * when sent to the Vaiz API. Use blockers for tasks that block this task, and blocking for tasks
 * that this task blocks.
 */
export interface EditTaskRequest {
  taskId: string;
  name?: string;
  group?: string;
  priority?: TaskPriority;
  completed?: boolean;
  assignees?: string[];
  types?: string[];
  parentTask?: string;
  subtasks?: string[];
  milestones?: string[];
  dueStart?: string;
  dueEnd?: string;
  /** Task IDs that block this task (automatically sent as leftConnectors to API) */
  blockers?: string[];
  /** Task IDs that this task blocks (automatically sent as rightConnectors to API) */
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

/**
 * Set task blocker request
 * This will set up a blocking relationship between two tasks:
 * - The blocked task will have the blocker in its leftConnectors
 * - The blocker task will have the blocked task in its rightConnectors
 */
export interface SetTaskBlockerRequest {
  /** ID of the task that is being blocked */
  blockedTaskId: string;
  /** ID of the task that blocks the other task */
  blockerTaskId: string;
}

/**
 * Set task blocker response
 */
export interface SetTaskBlockerResponse {
  /** The updated blocked task */
  blockedTask: Task;
  /** The updated blocker task */
  blockerTask: Task;
}

import { CustomFieldType } from './enums';

/**
 * Board type
 */
export interface BoardType {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

/**
 * Board group
 */
export interface BoardGroup {
  id: string;
  name: string;
  boardTypeIds: string[];
}

/**
 * Board custom field
 */
export interface BoardCustomField {
  id: string;
  name: string;
  type: CustomFieldType;
  boardId: string;
  description?: string;
  hidden?: boolean;
  options?: any[];
}

/**
 * Board
 */
export interface Board {
  id: string;
  name: string;
  description?: string;
  types: BoardType[];
  groups: BoardGroup[];
  customFields: BoardCustomField[];
}

/**
 * Board response
 */
export interface BoardResponse {
  board: Board;
}

/**
 * Boards response
 */
export interface BoardsResponse {
  boards: Board[];
}

/**
 * Create board type request
 */
export interface CreateBoardTypeRequest {
  name: string;
  boardId: string;
  icon?: string;
  color?: string;
}

/**
 * Create board type response
 */
export interface CreateBoardTypeResponse {
  type: BoardType;
}

/**
 * Edit board type request
 */
export interface EditBoardTypeRequest {
  typeId: string;
  boardId: string;
  name?: string;
  icon?: string;
  color?: string;
}

/**
 * Edit board type response
 */
export interface EditBoardTypeResponse {
  type: BoardType;
}

/**
 * Create board group request
 */
export interface CreateBoardGroupRequest {
  name: string;
  boardId: string;
  boardTypeIds?: string[];
}

/**
 * Create board group response
 */
export interface CreateBoardGroupResponse {
  group: BoardGroup;
}

/**
 * Edit board group request
 */
export interface EditBoardGroupRequest {
  groupId: string;
  boardId: string;
  name?: string;
  boardTypeIds?: string[];
}

/**
 * Edit board group response
 */
export interface EditBoardGroupResponse {
  group: BoardGroup;
}

/**
 * Create board custom field request
 */
export interface CreateBoardCustomFieldRequest {
  name: string;
  type: CustomFieldType;
  boardId: string;
  description?: string;
  hidden?: boolean;
  options?: any[];
}

/**
 * Create board custom field response
 */
export interface CreateBoardCustomFieldResponse {
  field: BoardCustomField;
}

/**
 * Edit board custom field request
 */
export interface EditBoardCustomFieldRequest {
  fieldId: string;
  boardId: string;
  name?: string;
  description?: string;
  hidden?: boolean;
  options?: any[];
}

/**
 * Edit board custom field response
 */
export interface EditBoardCustomFieldResponse {
  field: BoardCustomField;
}

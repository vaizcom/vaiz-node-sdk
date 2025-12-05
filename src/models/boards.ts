import { CustomFieldType, Icon, Color } from './enums';

/**
 * Board type
 */
export interface BoardType {
  id: string;
  label: string; // API uses "label", not "name"
  icon: Icon; // Icon enum
  color: Color | string; // Color enum value or string
  description?: string;
  hidden?: boolean;
  // Legacy alias for backward compatibility
  name?: string;
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
  label: string; // API uses "label", not "name"
  boardId: string;
  icon: Icon; // Required, must be Icon enum
  color: Color; // Required, must be Color enum
  // Legacy alias for backward compatibility (will be converted to label)
  name?: string;
}

/**
 * Create board type payload
 */
export interface CreateBoardTypePayload {
  boardId: string;
  boardType: BoardType;
}

/**
 * Create board type response
 */
export interface CreateBoardTypeResponse {
  type: string;
  payload?: CreateBoardTypePayload;
  // Legacy alias for backward compatibility
  boardType?: BoardType;
}

/**
 * Edit board type request
 */
export interface EditBoardTypeRequest {
  typeId: string;
  boardId: string;
  label?: string; // API uses "label", not "name"
  icon?: Icon; // Must be Icon enum if provided
  color?: Color; // Must be Color enum if provided
  description?: string;
  hidden?: boolean;
  // Legacy alias for backward compatibility (will be converted to label)
  name?: string;
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

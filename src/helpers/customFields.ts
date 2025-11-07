/**
 * Custom Fields Helper Functions
 * 
 * This module provides helper functions for creating and managing custom fields
 * in the Vaiz SDK with strong typing and simplified APIs.
 */

import * as crypto from 'crypto';
import {
  CreateBoardCustomFieldRequest,
  EditBoardCustomFieldRequest,
  CustomFieldType,
  Color,
  Icon,
} from '../models';

/**
 * Select field option
 */
export class SelectOption {
  title: string;
  color: Color;
  icon: Icon;
  id: string;

  constructor(title: string, color: Color, icon: Icon, optionId?: string) {
    this.title = title;
    this.color = color;
    this.icon = icon;
    this.id = optionId || this.generateId(title);
  }

  private generateId(title: string): string {
    return crypto.createHash('md5').update(title).digest('hex').substring(0, 24);
  }

  toDict(): any {
    return {
      _id: this.id,
      title: this.title,
      color: this.color,
      icon: this.icon,
    };
  }
}

/**
 * Create a select field option
 */
export function makeSelectOption(
  title: string,
  color: Color,
  icon: Icon,
  optionId?: string
): SelectOption {
  return new SelectOption(title, color, icon, optionId);
}

/**
 * Create a text custom field request
 */
export function makeTextField(
  name: string,
  boardId: string,
  description?: string,
  hidden: boolean = false
): CreateBoardCustomFieldRequest {
  return {
    name,
    type: CustomFieldType.TEXT,
    boardId,
    description,
    hidden,
  };
}

/**
 * Create a number custom field request
 */
export function makeNumberField(
  name: string,
  boardId: string,
  description?: string,
  hidden: boolean = false
): CreateBoardCustomFieldRequest {
  return {
    name,
    type: CustomFieldType.NUMBER,
    boardId,
    description,
    hidden,
  };
}

/**
 * Create a checkbox custom field request
 */
export function makeCheckboxField(
  name: string,
  boardId: string,
  description?: string,
  hidden: boolean = false
): CreateBoardCustomFieldRequest {
  return {
    name,
    type: CustomFieldType.CHECKBOX,
    boardId,
    description,
    hidden,
  };
}

/**
 * Create a date custom field request
 */
export function makeDateField(
  name: string,
  boardId: string,
  description?: string,
  hidden: boolean = false
): CreateBoardCustomFieldRequest {
  return {
    name,
    type: CustomFieldType.DATE,
    boardId,
    description,
    hidden,
  };
}

/**
 * Create a member custom field request
 */
export function makeMemberField(
  name: string,
  boardId: string,
  description?: string,
  hidden: boolean = false
): CreateBoardCustomFieldRequest {
  return {
    name,
    type: CustomFieldType.MEMBER,
    boardId,
    description,
    hidden,
  };
}

/**
 * Create a task relations custom field request
 */
export function makeTaskRelationsField(
  name: string,
  boardId: string,
  description?: string,
  hidden: boolean = false
): CreateBoardCustomFieldRequest {
  return {
    name,
    type: CustomFieldType.TASK_RELATIONS,
    boardId,
    description,
    hidden,
  };
}

/**
 * Create a select custom field request with options
 */
export function makeSelectField(
  name: string,
  boardId: string,
  options: (SelectOption | any)[],
  description?: string,
  hidden: boolean = false
): CreateBoardCustomFieldRequest {
  const formattedOptions = options.map(option => {
    if (option instanceof SelectOption) {
      return option.toDict();
    } else if (typeof option === 'object') {
      return option;
    } else {
      throw new Error(`Invalid option type. Must be SelectOption or object.`);
    }
  });

  return {
    name,
    type: CustomFieldType.SELECT,
    boardId,
    description,
    hidden,
    options: formattedOptions,
  };
}

/**
 * Create a URL custom field request
 */
export function makeUrlField(
  name: string,
  boardId: string,
  description?: string,
  hidden: boolean = false
): CreateBoardCustomFieldRequest {
  return {
    name,
    type: CustomFieldType.URL,
    boardId,
    description,
    hidden,
  };
}

/**
 * Add a new option to an existing select field
 */
export function addBoardCustomFieldSelectOption(
  fieldId: string,
  boardId: string,
  newOption: SelectOption | any,
  existingOptions: any[]
): EditBoardCustomFieldRequest {
  const formattedOption = newOption instanceof SelectOption
    ? newOption.toDict()
    : newOption;

  const updatedOptions = [...existingOptions, formattedOption];

  return {
    fieldId,
    boardId,
    options: updatedOptions,
  };
}

/**
 * Remove an option from an existing select field
 */
export function removeBoardCustomFieldSelectOption(
  fieldId: string,
  boardId: string,
  optionId: string,
  existingOptions: any[]
): EditBoardCustomFieldRequest {
  const updatedOptions = existingOptions.filter(opt => opt._id !== optionId);

  if (updatedOptions.length === existingOptions.length) {
    throw new Error(`Option with ID '${optionId}' not found in existing options`);
  }

  return {
    fieldId,
    boardId,
    options: updatedOptions,
  };
}

/**
 * Edit an existing option in a select field
 */
export function editBoardCustomFieldSelectFieldOption(
  fieldId: string,
  boardId: string,
  optionId: string,
  updatedOption: SelectOption | any,
  existingOptions: any[]
): EditBoardCustomFieldRequest {
  let formattedOption: any;
  
  if (updatedOption instanceof SelectOption) {
    formattedOption = updatedOption.toDict();
    if (!formattedOption._id || formattedOption._id !== optionId) {
      formattedOption._id = optionId;
    }
  } else {
    formattedOption = { ...updatedOption, _id: optionId };
  }

  const updatedOptions = existingOptions.map(opt => 
    opt._id === optionId ? formattedOption : opt
  );

  if (!updatedOptions.some(opt => opt._id === optionId)) {
    throw new Error(`Option with ID '${optionId}' not found in existing options`);
  }

  return {
    fieldId,
    boardId,
    options: updatedOptions,
  };
}

// Field editing helpers

/**
 * Edit the name of an existing custom field
 */
export function editCustomFieldName(
  fieldId: string,
  boardId: string,
  newName: string
): EditBoardCustomFieldRequest {
  return {
    fieldId,
    boardId,
    name: newName,
  };
}

/**
 * Edit the description of an existing custom field
 */
export function editCustomFieldDescription(
  fieldId: string,
  boardId: string,
  newDescription?: string
): EditBoardCustomFieldRequest {
  return {
    fieldId,
    boardId,
    description: newDescription,
  };
}

/**
 * Edit the visibility of an existing custom field
 */
export function editCustomFieldVisibility(
  fieldId: string,
  boardId: string,
  hidden: boolean
): EditBoardCustomFieldRequest {
  return {
    fieldId,
    boardId,
    hidden,
  };
}

/**
 * Edit multiple properties of an existing custom field at once
 */
export function editCustomFieldComplete(
  fieldId: string,
  boardId: string,
  name?: string,
  description?: string,
  hidden?: boolean,
  options?: any[]
): EditBoardCustomFieldRequest {
  const request: EditBoardCustomFieldRequest = {
    fieldId,
    boardId,
  };

  if (name !== undefined) request.name = name;
  if (description !== undefined) request.description = description;
  if (hidden !== undefined) request.hidden = hidden;
  if (options !== undefined) request.options = options;

  return request;
}

// Task relations helpers

/**
 * Create a properly formatted value for task relations custom field
 */
export function makeTaskRelationValue(relatedTaskIds: string[]): string[] {
  return relatedTaskIds;
}

/**
 * Add a new task relation to existing relations
 */
export function addTaskRelation(
  currentRelations: string[],
  newTaskId: string
): string[] {
  if (!currentRelations.includes(newTaskId)) {
    return [...currentRelations, newTaskId];
  }
  return currentRelations;
}

/**
 * Remove a task relation from existing relations
 */
export function removeTaskRelation(
  currentRelations: string[],
  taskIdToRemove: string
): string[] {
  return currentRelations.filter(taskId => taskId !== taskIdToRemove);
}

// Member field helpers

/**
 * Create a properly formatted value for member custom field
 */
export function makeMemberValue(memberIds: string | string[]): string | string[] {
  return memberIds;
}

/**
 * Add a new member to an existing member field
 */
export function addMemberToField(
  currentMembers: string | string[],
  newMemberId: string
): string[] {
  const membersList = Array.isArray(currentMembers) ? currentMembers : [currentMembers];
  
  if (!membersList.includes(newMemberId)) {
    return [...membersList, newMemberId];
  }
  
  return membersList;
}

/**
 * Remove a member from an existing member field
 */
export function removeMemberFromField(
  currentMembers: string | string[],
  memberIdToRemove: string
): string | string[] {
  if (typeof currentMembers === 'string') {
    return currentMembers === memberIdToRemove ? [] : currentMembers;
  }

  const filteredMembers = currentMembers.filter(memberId => memberId !== memberIdToRemove);

  if (filteredMembers.length === 0) {
    return [];
  } else if (filteredMembers.length === 1) {
    return filteredMembers[0];
  } else {
    return filteredMembers;
  }
}

// Date field helpers

/**
 * Create a properly formatted value for date custom field
 */
export function makeDateValue(date: Date | string): string {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return date;
}

/**
 * Create a properly formatted value for date range custom field
 */
export function makeDateRangeValue(
  startDate: Date | string,
  endDate: Date | string
): { start: string; end: string } {
  const startStr = startDate instanceof Date ? startDate.toISOString() : startDate;
  const endStr = endDate instanceof Date ? endDate.toISOString() : endDate;

  return {
    start: startStr,
    end: endStr,
  };
}

// Value formatting helpers

/**
 * Create a properly formatted value for text custom field
 */
export function makeTextValue(text: string): string {
  return String(text);
}

/**
 * Create a properly formatted value for number custom field
 */
export function makeNumberValue(number: number | string): string {
  return String(number);
}

/**
 * Create a properly formatted value for checkbox custom field
 */
export function makeCheckboxValue(checked: boolean): string {
  return checked ? 'true' : 'false';
}

/**
 * Create a properly formatted value for URL custom field
 */
export function makeUrlValue(url: string): string {
  return String(url);
}


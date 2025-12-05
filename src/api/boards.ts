import { BaseAPIClient } from './base';
import {
  BoardResponse,
  BoardsResponse,
  CreateBoardTypeRequest,
  CreateBoardTypeResponse,
  EditBoardTypeRequest,
  EditBoardTypeResponse,
  CreateBoardGroupRequest,
  CreateBoardGroupResponse,
  EditBoardGroupRequest,
  EditBoardGroupResponse,
  CreateBoardCustomFieldRequest,
  CreateBoardCustomFieldResponse,
  EditBoardCustomFieldRequest,
  EditBoardCustomFieldResponse,
} from '../models';

/**
 * Boards API Client
 */
export class BoardsAPIClient extends BaseAPIClient {
  /**
   * Get all boards
   */
  async getBoards(): Promise<BoardsResponse> {
    const response = await this.makeRequest<BoardsResponse>('getBoards', 'POST');
    return response;
  }

  /**
   * Get a specific board by ID
   */
  async getBoard(boardId: string): Promise<BoardResponse> {
    const response = await this.makeRequest<BoardResponse>('getBoard', 'POST', { boardId });
    return response;
  }

  /**
   * Create a board type
   */
  async createBoardType(request: CreateBoardTypeRequest): Promise<CreateBoardTypeResponse> {
    // Convert legacy "name" to "label" if provided
    const cleanRequest: any = {
      boardId: request.boardId,
      label: request.label || request.name,
      icon: request.icon,
      color: request.color,
    };

    const response = await this.makeRequest<CreateBoardTypeResponse>(
      'createBoardType',
      'POST',
      cleanRequest
    );

    // Add legacy alias for backward compatibility
    if (response.payload?.boardType && !response.boardType) {
      (response as any).boardType = response.payload.boardType;
    }

    return response;
  }

  /**
   * Edit a board type
   */
  async editBoardType(request: EditBoardTypeRequest): Promise<EditBoardTypeResponse> {
    // Convert legacy "name" to "label" if provided
    const cleanRequest: any = {
      boardTypeId: request.typeId,
      boardId: request.boardId,
    };

    if (request.label !== undefined) {
      cleanRequest.label = request.label;
    } else if (request.name !== undefined) {
      cleanRequest.label = request.name;
    }

    if (request.icon !== undefined) {
      cleanRequest.icon = request.icon;
    }

    if (request.color !== undefined) {
      cleanRequest.color = request.color;
    }

    if (request.description !== undefined) {
      cleanRequest.description = request.description;
    }

    if (request.hidden !== undefined) {
      cleanRequest.hidden = request.hidden;
    }

    const response = await this.makeRequest<EditBoardTypeResponse>(
      'editBoardType',
      'POST',
      cleanRequest
    );
    return response;
  }

  /**
   * Create a board group
   */
  async createBoardGroup(request: CreateBoardGroupRequest): Promise<CreateBoardGroupResponse> {
    const response = await this.makeRequest<CreateBoardGroupResponse>(
      'createBoardGroup',
      'POST',
      request
    );
    return response;
  }

  /**
   * Edit a board group
   */
  async editBoardGroup(request: EditBoardGroupRequest): Promise<EditBoardGroupResponse> {
    const response = await this.makeRequest<EditBoardGroupResponse>(
      'editBoardGroup',
      'POST',
      request
    );
    return response;
  }

  /**
   * Create a board custom field
   */
  async createBoardCustomField(
    request: CreateBoardCustomFieldRequest
  ): Promise<CreateBoardCustomFieldResponse> {
    const response = await this.makeRequest<CreateBoardCustomFieldResponse>(
      'createBoardCustomField',
      'POST',
      request
    );
    return response;
  }

  /**
   * Edit a board custom field
   */
  async editBoardCustomField(
    request: EditBoardCustomFieldRequest
  ): Promise<EditBoardCustomFieldResponse> {
    const response = await this.makeRequest<EditBoardCustomFieldResponse>(
      'editBoardCustomField',
      'POST',
      request
    );
    return response;
  }
}

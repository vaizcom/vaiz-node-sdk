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
    const response = await this.makeRequest<CreateBoardTypeResponse>('createBoardType', 'POST', request);
    return response;
  }

  /**
   * Edit a board type
   */
  async editBoardType(request: EditBoardTypeRequest): Promise<EditBoardTypeResponse> {
    const response = await this.makeRequest<EditBoardTypeResponse>('editBoardType', 'POST', request);
    return response;
  }

  /**
   * Create a board group
   */
  async createBoardGroup(request: CreateBoardGroupRequest): Promise<CreateBoardGroupResponse> {
    const response = await this.makeRequest<CreateBoardGroupResponse>('createBoardGroup', 'POST', request);
    return response;
  }

  /**
   * Edit a board group
   */
  async editBoardGroup(request: EditBoardGroupRequest): Promise<EditBoardGroupResponse> {
    const response = await this.makeRequest<EditBoardGroupResponse>('editBoardGroup', 'POST', request);
    return response;
  }

  /**
   * Create a board custom field
   */
  async createBoardCustomField(request: CreateBoardCustomFieldRequest): Promise<CreateBoardCustomFieldResponse> {
    const response = await this.makeRequest<CreateBoardCustomFieldResponse>('createBoardCustomField', 'POST', request);
    return response;
  }

  /**
   * Edit a board custom field
   */
  async editBoardCustomField(request: EditBoardCustomFieldRequest): Promise<EditBoardCustomFieldResponse> {
    const response = await this.makeRequest<EditBoardCustomFieldResponse>('editBoardCustomField', 'POST', request);
    return response;
  }
}

